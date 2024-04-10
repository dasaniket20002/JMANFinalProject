{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

TIMESHEETS AS (
    SELECT * FROM {{ source('raw_src', 'timesheets') }}
),



TIMESHEETS2 AS (
    SELECT USEREMAIL, DATESTART, DATEEND, PROJECTSELECTED,
        CASE
            WHEN COMMENTADDED IS NULL
            THEN ''
            ELSE COMMENTADDED
        END AS COMMENTADDED,

        CASE 
            WHEN D0 IS NULL
            THEN 0
            ELSE D0
        END AS D0,

        CASE 
            WHEN D1 IS NULL
            THEN 0
            ELSE D1
        END AS D1,

        CASE 
            WHEN D2 IS NULL
            THEN 0
            ELSE D2
        END AS D2,

        CASE 
            WHEN D3 IS NULL
            THEN 0
            ELSE D3
        END AS D3,

        CASE 
            WHEN D4 IS NULL
            THEN 0
            ELSE D4
        END AS D4,

        CASE 
            WHEN D5 IS NULL
            THEN 0
            ELSE D5
        END AS D5,

        CASE 
            WHEN D6 IS NULL
            THEN 0
            ELSE D6
        END AS D6,

        ACTIVITYNAME

    FROM TIMESHEETS
),

STG_TIMESHEETS AS (
    SELECT 
        CAST(USEREMAIL AS VARCHAR) AS USER_EMAIL,
        CAST(DATESTART AS VARCHAR) AS DATE_START,
        CAST(DATEEND AS VARCHAR) AS DATE_END,
        CAST(PROJECTSELECTED AS VARCHAR) AS PROJECT_SELECTED,
        CAST(COMMENTADDED AS VARCHAR) AS COMMENT_ADDED,
        CAST(D0 AS NUMBER) AS D0,
        CAST(D1 AS NUMBER) AS D1,
        CAST(D2 AS NUMBER) AS D2, 
        CAST(D3 AS NUMBER) AS D3, 
        CAST(D4 AS NUMBER) AS D4, 
        CAST(D5 AS NUMBER) AS D5, 
        CAST(D6 AS NUMBER) AS D6,
        CAST(ACTIVITYNAME AS VARCHAR) AS ACTIVITY_NAME
    FROM 
        TIMESHEETS2
)

SELECT * FROM STG_TIMESHEETS