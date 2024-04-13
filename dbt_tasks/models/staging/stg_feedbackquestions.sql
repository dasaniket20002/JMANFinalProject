{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

RAW_DATA AS (
    SELECT * FROM {{ source('raw_src', 'feedbackquestions') }}
),

CAST_DATA AS (
    SELECT 
        CAST(ID AS VARCHAR) AS ID,
        CAST(QUESTION AS VARCHAR) AS QUESTION,
    FROM 
        RAW_DATA
)

SELECT * FROM CAST_DATA