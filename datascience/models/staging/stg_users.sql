{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

USERS AS (
    SELECT * FROM {{ source('raw_src', 'users') }}
),

TRIMMED AS (
    SELECT * FROM USERS
    WHERE C1 NOT LIKE 'email'
),

STG_USERS AS (
    SELECT 
        CAST(C1 AS VARCHAR) AS EMAIL,
        CAST(C2 AS VARCHAR) AS PASS,
        CAST(C3 AS VARCHAR) AS ROLE,
        CAST(C4 AS VARCHAR) AS NAME
    FROM 
        TRIMMED
)

SELECT * FROM STG_USERS