{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

RAW_DATA AS (
    SELECT * FROM {{ source('raw_src', 'feedbackquestions') }}
),

REMOVE_HEADERS AS (
    SELECT * FROM RAW_DATA
    WHERE 
        C1 NOT LIKE 'id'
        OR
        C2 NOT LIKE 'question'
),

CAST_DATA AS (
    SELECT 
        CAST(C1 AS VARCHAR) AS ID,
        CAST(C2 AS VARCHAR) AS QUESTION,
    FROM 
        REMOVE_HEADERS
)

SELECT * FROM CAST_DATA