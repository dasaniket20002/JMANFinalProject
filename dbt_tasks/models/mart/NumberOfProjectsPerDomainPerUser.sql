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

NUMBER_OF_PROJECTS_PER_DOMAIN AS (
    SELECT 
        FA.USER_EMAIL,
        U.NAME,
        P.DOMAIN,
        AVG(FA.CHECKED_ANSWER) AS AVERAGE_RATING,
        COUNT(P.NAME) AS NUMBER_OF_PROJECTS_FOR_DOMAIN
    FROM 
        STG_FEEDBACKANSWERS FA,
        STG_USERS U,
        STG_PROJECTS P
    WHERE
        FA.USER_EMAIL = U.EMAIL
        AND 
        P.NAME = FA.PROJECT_NAME
    GROUP BY 
        FA.USER_EMAIL,
        U.NAME,
        P.DOMAIN
)

SELECT * FROM NUMBER_OF_PROJECTS_PER_DOMAIN