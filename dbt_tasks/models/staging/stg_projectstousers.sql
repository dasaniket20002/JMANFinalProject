{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

RAW_DATA AS (
    SELECT * FROM {{ source('raw_src', 'projectstousers') }}
),

REMOVE_HEADERS AS (
    SELECT * FROM RAW_DATA
    WHERE 
        C1 NOT LIKE 'projectName'
        OR
        C2 NOT LIKE 'userEmail'
),

CAST_DATA AS (
    SELECT 
        CAST(C1 AS VARCHAR) AS PROJECT_NAME,
        CAST(C2 AS VARCHAR) AS USER_EMAIL,
    FROM 
        REMOVE_HEADERS
)

SELECT * FROM CAST_DATA