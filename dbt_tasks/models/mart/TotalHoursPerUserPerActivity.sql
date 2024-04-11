{{
    config(
        tags=['mart']
    )
}}

WITH

STG_TIMESHEETS AS (
    SELECT * FROM {{ ref('stg_timesheets') }}
),

STG_USERS AS (
    SELECT * FROM {{ ref('stg_users') }}
),

TOTAL_HOURS_PER_USER_PER_ACTIVITY AS (
    SELECT 
        T.USER_EMAIL, 
        U.NAME,
        T.ACTIVITY_NAME,
        SUM(T.D0 + T.D1 + T.D2 + T.D3 + T.D4 + T.D5 + T.D6) AS TOTAL_HOURS,
        SUM(T.D0 + T.D6) AS TOTAL_HOURS_WEEKENDS,
        SUM(T.D1 + T.D2 + T.D3 + T.D4 + T.D5) AS TOTAL_HOURS_WEEKDAYS
    FROM 
        STG_TIMESHEETS T,
        STG_USERS U
    WHERE 
        T.USER_EMAIL = U.EMAIL
    GROUP BY 
        T.USER_EMAIL,
        U.NAME,
        T.ACTIVITY_NAME
)

SELECT * FROM TOTAL_HOURS_PER_USER_PER_ACTIVITY