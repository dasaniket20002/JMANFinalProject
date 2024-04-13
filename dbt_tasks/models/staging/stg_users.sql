{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

RAW_DATA AS (
    SELECT * FROM {{ source('raw_src', 'users') }}
),

CAST_DATA AS (
    SELECT 
        CAST(EMAIL AS VARCHAR) AS EMAIL,
        CAST(PASS AS VARCHAR) AS PASS,
        CAST(ROLE AS VARCHAR) AS ROLE,
        CAST(NAME AS VARCHAR) AS NAME
    FROM 
        RAW_DATA
)

SELECT * FROM CAST_DATA