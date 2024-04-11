{{
    config(
        tags=['mart']
    )
}}

WITH

STG_USERS AS (
    SELECT * FROM {{ ref('stg_users') }}
),

USERS_PER_ROLE AS (
    SELECT 
        ROLE,
        COUNT(EMAIL) AS COUNT
    FROM 
        STG_USERS
    GROUP BY 
        ROLE
)

SELECT * FROM USERS_PER_ROLE