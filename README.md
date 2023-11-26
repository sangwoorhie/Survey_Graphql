# Survey Project

<p align="center"><img src="https://github.com/sangwoorhie/BackEnd/assets/131964697/a62d2ac9-105f-4522-8f41-1f56b167617c"></p>

## 🎯서비스 소개

Survey Project는 객관식 문항을 만들 수 있는 설문지 입니다. 설문지에 여러 개의 문항을 생성할 수 있고, 하나의 문항에는 1부터 5까지 번호를 가진 선택지를 만들 수 있습니다. 각 선택지별 1부터 5까지 고유한 점수가 존재하며, 답안을 했을 시 해당 답안과 일치하는 번호를 가진 선택지의 점수가 곧 문항의 점수가 됩니다. 설문지의 총점은 모든 문항 점수들의 합이며, 모든 문항들이 답변되었을 경우 설문지 완료를 할 수 있습니다.<br>
<br>
<br>

## 🔎설치 및 실행 방법

```bash
$ npm install
```
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

```
- npm run start:dev로 서버를 실행시킨 다음에, http://localhost:4000/graphql 에 접속하여 Playground에서 테스트. (포트번호 4000)
- API별 각각의 CRUD 자세한 실행 방법은 포트폴리오 ([Portfolio](https://lemon-coin-768.notion.site/Survey-Project-0811413ea7ba4b12a839b610040079fd?pvs=4)) 참고<br>
 <br>
 <br>

## 💡API

-  설문지  CRUD
-  문항 CRUD
-  선택지 CRUD
-  답변 CRUD
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

- ERD : [[drawsql.app/teams/jake-7/diagrams/outbody-erd](https://drawsql.app/teams/jake-7/diagrams/survey-project)]

![drawSQL-survey-project-export-2023-11-26](https://github.com/sangwoorhie/BackEnd/assets/131964697/a56dce2c-c1e5-4ff0-a51c-861380e09d28)
<br>
<br>


