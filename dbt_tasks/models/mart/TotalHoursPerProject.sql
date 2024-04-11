{{
    config(
        tags=['mart']
    )
}}

WITH

STG_TIMESHEETS AS (
    SELECT * FROM {{ ref('stg_timesheets') }}
),

TOTAL_HOURS_PER_PROJECT AS (
    SELECT 
        PROJECT_SELECTED,
        SUM(D0 + D1 + D2 + D3 + D4 + D5 + D6) AS TOTAL_HOURS,
        SUM(D0 + D6) AS TOTAL_HOURS_WEEKENDS,
        SUM(D1 + D2 + D3 + D4 + D5) AS TOTAL_HOURS_WEEKDAYS
    FROM 
        STG_TIMESHEETS
    GROUP BY 
        PROJECT_SELECTED
)

SELECT * FROM TOTAL_HOURS_PER_PROJECT