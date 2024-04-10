{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

FEEDBACKQUESTIONS AS (
    SELECT * FROM {{ source('raw_src', 'feedbackquestions') }}
),

TRIMMED AS (
    SELECT * FROM FEEDBACKQUESTIONS
    WHERE C1 NOT LIKE 'id'
),

STG_FEEDBACKQUESTIONS AS (
    SELECT 
        CAST(C1 AS VARCHAR) AS ID,
        CAST(C2 AS VARCHAR) AS QUESTION
    FROM 
        TRIMMED
)

SELECT * FROM STG_FEEDBACKQUESTIONS