{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

RAW_DATA AS (
    SELECT * FROM {{ source('raw_src', 'projectstofeedbackquestions') }}
),

CAST_DATA AS (
    SELECT 
        CAST(PROJECTNAME AS VARCHAR) AS PROJECT_NAME,
        CAST(QUESTIONNAME AS VARCHAR) AS QUESTION_NAME,
    FROM 
        RAW_DATA
)

SELECT * FROM CAST_DATA