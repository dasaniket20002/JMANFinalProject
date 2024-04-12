{{
    config(
        tags=['mart']
    )
}}

WITH

STG_FEEDBACKANSWERS AS (
    SELECT * FROM {{ ref('stg_feedbackanswers') }}
),

STG_USERS AS (
    SELECT * FROM {{ ref('stg_users') }}
),

STG_PROJECTS AS (
    SELECT * FROM {{ ref('stg_projects') }}
),

AVERAGE_RATING_FOR_PROJECTS_PER_USER AS (
    SELECT 
        FA.USER_EMAIL,
        U.NAME,
        FA.PROJECT_NAME,
        P.DOMAIN,
        AVG(FA.CHECKED_ANSWER) AS AVERAGE_RATING,
    FROM 
        STG_FEEDBACKANSWERS FA,
        STG_USERS U,
        STG_PROJECTS P
    WHERE
        FA.USER_EMAIL = U.EMAIL
        AND
        P.NAME = FA.PROJECT_NAME
    GROUP BY 
        FA.PROJECT_NAME,
        FA.USER_EMAIL,
        U.NAME,
        P.DOMAIN
)

SELECT * FROM AVERAGE_RATING_FOR_PROJECTS_PER_USER