{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

PROJECTS AS (
    SELECT * FROM {{ source('raw_src', 'projects') }}
),

STG_PROJECTS AS (
    SELECT 
        CAST(ID AS VARCHAR) AS ID,
        CAST(NAME AS VARCHAR) AS NAME
    FROM PROJECTS
)

SELECT * FROM STG_PROJECTS