{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

RAW_DATA AS (
    SELECT * FROM {{ source('raw_src', 'users') }}
),

REMOVE_HEADERS AS (
    SELECT * FROM RAW_DATA
    WHERE 
        C1 NOT LIKE 'email'
        OR
        C2 NOT LIKE 'pass'
        OR
        C3 NOT LIKE 'role'
        OR
        C4 NOT LIKE 'name'
),

CAST_DATA AS (
    SELECT 
        CAST(C1 AS VARCHAR) AS EMAIL,
        CAST(C2 AS VARCHAR) AS PASS,
        CAST(C3 AS VARCHAR) AS ROLE,
        CAST(C4 AS VARCHAR) AS NAME
    FROM 
        REMOVE_HEADERS
)

SELECT * FROM CAST_DATA