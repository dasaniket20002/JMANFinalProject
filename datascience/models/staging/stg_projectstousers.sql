{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

PROJECTSTOUSERS AS (
    SELECT * FROM {{ source('raw_src', 'projectstousers') }}
),

TRIMMED AS (
    SELECT * FROM PROJECTSTOUSERS
    WHERE C1 NOT LIKE 'projectName'
),

STG_PROJECTSTOUSERS AS (
    SELECT 
        CAST(C1 AS VARCHAR) AS PROJECT_NAME,
        CAST(C2 AS VARCHAR) AS USER_EMAIL
    FROM 
        TRIMMED
)

SELECT * FROM STG_PROJECTSTOUSERS