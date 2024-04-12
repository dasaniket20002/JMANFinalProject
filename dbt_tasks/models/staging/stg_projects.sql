{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

RAW_DATA AS (
    SELECT * FROM {{ source('raw_src', 'projects') }}
),

REMOVE_HEADERS AS (
    SELECT * FROM RAW_DATA
    WHERE 
        C1 NOT LIKE 'id'
        OR
        C2 NOT LIKE 'name'
        OR
        C3 NOT LIKE 'domain'
),

CAST_DATA AS (
    SELECT 
        CAST(C1 AS VARCHAR) AS ID,
        CAST(C2 AS VARCHAR) AS NAME,
        CAST(C3 AS VARCHAR) AS DOMAIN
    FROM 
        REMOVE_HEADERS
)

SELECT * FROM CAST_DATA