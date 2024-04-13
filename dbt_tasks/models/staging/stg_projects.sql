{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

RAW_DATA AS (
    SELECT * FROM {{ source('raw_src', 'projects') }}
),

CAST_DATA AS (
    SELECT 
        CAST(ID AS VARCHAR) AS ID,
        CAST(NAME AS VARCHAR) AS NAME,
        CAST(DOMAIN AS VARCHAR) AS DOMAIN
    FROM 
        RAW_DATA
)

SELECT * FROM CAST_DATA