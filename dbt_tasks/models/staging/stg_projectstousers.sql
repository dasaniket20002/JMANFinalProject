{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

RAW_DATA AS (
    SELECT * FROM {{ source('raw_src', 'projectstousers') }}
),

CAST_DATA AS (
    SELECT 
        CAST(PROJECTNAME AS VARCHAR) AS PROJECT_NAME,
        CAST(USEREMAIL AS VARCHAR) AS USER_EMAIL,
    FROM 
        RAW_DATA
)

SELECT * FROM CAST_DATA