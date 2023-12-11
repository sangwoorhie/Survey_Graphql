# Survey Project

<p align="center"><img src="https://github.com/sangwoorhie/BackEnd/assets/131964697/a62d2ac9-105f-4522-8f41-1f56b167617c"></p>

## 🎯서비스 소개

Survey Project는 객관식 선택지 문항을 만들 수 있는 설문지 입니다. 설문지에 여러 개의 문항을 생성할 수 있고, 하나의 문항에는 최소1부터 최대5 까지 각각 번호와 점수를 가진 선택지를 만들 수 있습니다. 동일한 설문지와 문항 안에 존재하는 선택지 끼리는 각각 번호의 중복 및 점수의 중복이 허용되지 않도록 설정하였습니다.<br>
<br>
답안을 작성할 때는 선택지에 있는 번호만 답안으로 작성 가능하도록 설정하였으며, 1부터 5까지 중에 답안을 작성했을 시 해당 답안과 일치하는 번호를 가진 선택지의 점수가 곧 문항의 점수가 됩니다. 설문지의 총점은 해당 설문지에 있는 모든 답변된 문항들의 점수 합으로 반환되며, 모든 문항들이 답변되었을 경우에만 설문지 완료를 할 수 있습니다.<br>
<br>
<br>

## 🔎설치 및 실행 방법

``인
-  설문지 완료
-  완료된 설문지 확인

|          API         |    Method alias  |      API       |    Method alias    |
|----------------------|------------------|----------------|--------------------|
|   설문지 목록조회    |  getAllSurveys    |    문항 삭제   |   deleteQuestion   |
|   단일 설문지 조회   |  getSingleSurvey  | 선택지 목록조회|    getAllOptions   |
|완료된 설문지목록 조회|   getDoneSurveys  | 단일 선택지조회|   getSingleOption  |
|     설문지 생성      |   createSurvey    |   선택지 생성  |    createOption    |
|     설문지 수정      |   updateSurvey    |   선택지 수정  |    updateOption    |
|     설문지 삭제      |   deleteSurvey    |   선택지 삭제  |    deleteOption    |
|     설문지 완료      |   completeSurvey  |  답안 목록조회 |    getAllAnswers   |
|    문항 목록조회     |  getAllQuestions  |  단일 답안조회 |   getSingleAnswer  |
|     단일 문항조회    | getSingleQuestion |    답안 생성   |    createAnswer    |
|      문항 생성       |  createQuestion   |    답안 수정   |    updateAnswer    |
|      문항 수정       |  updateQuestion   |    답안 삭제   |    deleteAnswer    |
|      회원 가입       |    createUser     |    회원 탈퇴   |     deleteUser     |
|    회원정보 수정     |    updateUser     |  단일 회원조회 |    getSingleUser   |
|       로그인         |     loginUser     |                |                    |


<br>
<br>

## ⚒️사용 기술

- TypeScript
- Nest.js
- Graphql
- TypeOrm
- PostgreSql

<br>
<br>

## 📊ERD

- ERD : [[(https://drawsql.app/teams/jake-7/diagrams/survey-project)](https://drawsql.app/teams/jake-7/diagrams/survey-project)]

![image](https://github.com/sangwoorhie/Survey_Project/assets/131964697/6e23f6e6-61b3-470f-ac28-f747ec52d408)
<br>
<br>


