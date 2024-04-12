{{
    config(
        tags=['mart']
    )
}}

WITH

STG_FEEDBACKANSWERS AS (
    SELECT * FROM {{ ref('stg_feedbackanswers') }}
),

AVERAGE_RATING_FOR_PROJECTS AS (
    SELECT 
        PROJECT_NAME,
        AVG(CHECKED_ANSWER) AS AVERAGE_RATING,
    FROM 
        STG_FEEDBACKANSWERS
    GROUP BY 
        PROJECT_NAME
)

SELECT * FROM AVERAGE_RATING_FOR_PROJECTS