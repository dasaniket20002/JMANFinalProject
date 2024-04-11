{{
    config(
        tags=['basic', 'staging']
    )
}}

WITH

RAW_DATA AS (
    SELECT * FROM {{ source('raw_src', 'feedbackanswers') }}
),

REMOVE_HEADERS AS (
    SELECT * FROM RAW_DATA
    WHERE 
        C1 NOT LIKE 'projectName'
        OR
        C2 NOT LIKE 'feedbackQuestionName'
        OR
        C3 NOT LIKE 'dateStart'
        OR
        C4 NOT LIKE 'dateEnd'
        OR
        C5 NOT LIKE 'userEmail'
        OR
        C6 NOT LIKE 'checkedAnswer'
        OR
        C7 NOT LIKE 'textAnswer'
),

CAST_DATA AS (
    SELECT 
        CAST(C1 AS VARCHAR) AS PROJECT_NAME,
        CAST(C2 AS VARCHAR) AS FEEDBACKQUESTION_NAME,
        CAST(C3 AS VARCHAR) AS DATE_START,
        CAST(C4 AS VARCHAR) AS DATE_END,
        CAST(C5 AS VARCHAR) AS USER_EMAIL,
        CAST(C6 AS NUMBER) AS CHECKED_ANSWER,
        CAST(C7 AS VARCHAR) AS TEXT_ANSWER,
    FROM 
        REMOVE_HEADERS
),

REMOVE_NULLS AS (
    SELECT 
        PROJECT_NAME, FEEDBACKQUESTION_NAME, DATE_START, DATE_END, USER_EMAIL,
        CASE
            WHEN CHECKED_ANSWER IS NULL
            THEN 0
            ELSE CHECKED_ANSWER 
        END AS CHECKED_ANSWER,

        CASE
            WHEN TEXT_ANSWER IS NULL
            THEN ''
            ELSE TEXT_ANSWER 
        END AS TEXT_ANSWER,

    FROM CAST_DATA
)

SELECT * FROM REMOVE_NULLS