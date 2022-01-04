const faker = require("faker")
const mongoose = require("mongoose")
const User = require("../../models/UserModel")
const Activity = require("../../models/activityModel")
const Course = require("../../models/CourseModel")
const PdfActivityModel = require("../../models/pdfActivityModel")
const QuizActivityModel = require("../../models/quizActivityModel")
const VideoActivityModel = require("../../models/videoActivityModel")
const QuestionModel = require("../../models/questionModel")
const generatePasswordHashAndSalt = require("../../utils/generatePasswordHashAndSalt")

const connectDB = async () => {
  const DB = "mongodb://localhost:27017/elearning"
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  } catch (err) {
    console.log("Failed to connect to DB")
    console.log(err)
    process.exit(1)
  }
}

const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
  } catch (error) {
    console.log("Failed to disconnect DB")
  }
}

const dropDB = async () => {
  try {
    await mongoose.connection.db.dropDatabase()
  } catch (error) {
    console.log("Failed to drop DB")
    console.log(error)
    process.exit(1)
  }
}

const createRandomUser = async (type, courses, index) => {
  const password = "123456789"
  const passwordHash = await generatePasswordHashAndSalt(password)
  const user = {
    username: `${type}.${index}`,
    password: passwordHash,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    birthDate: faker.date.past(),
    created_at: new Date(),
    passwordLastChangedAt: new Date(),
    type,
  }

  if (type === "instructor") user["background"] = faker.lorem.sentence()
  else user["enrolledCourses"] = faker.helpers.shuffle(courses).slice(0, 4)

  return user
}

const createRandomCourse = async (instructorId, index) => {
  const syllabus = ["begginers level", "intermediate level", "advanced level"]
  const course = {
    title: `course ${index}`,
    syllabus: faker.helpers.randomize(syllabus),
    instructor: instructorId,
  }
  return course
}

const createRandomVideoActivity = (course) => {
  const urls = [
    "https://www.youtube.com/watch?v=j-iq40QBJy8&list=PLYp4IGUhNFmw8USiYMJvCUjZe79fvyYge",
    "https://www.youtube.com/watch?v=D_a2DNSEOa8&list=PLYp4IGUhNFmw8USiYMJvCUjZe79fvyYge&index=2",
    "https://www.youtube.com/watch?v=Q8OEPEu4GVY&list=PLYp4IGUhNFmw8USiYMJvCUjZe79fvyYge&index=3",
    "https://www.youtube.com/watch?v=P6A1OM4X924&list=PLYp4IGUhNFmw8USiYMJvCUjZe79fvyYge&index=4",
    "https://www.youtube.com/watch?v=8Uxt9scWJBY&list=PLYp4IGUhNFmw8USiYMJvCUjZe79fvyYge&index=5",
    "https://www.youtube.com/watch?v=Q-dxGaR3fH0&list=PLYp4IGUhNFmw8USiYMJvCUjZe79fvyYge&index=6",
  ]

  const activity = {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    course,
    url: faker.helpers.randomize(urls),
  }
  return activity
}
const createLearners = async (numberOfLearners, courses) => {
  const learners = []
  for (let i = 0; i < numberOfLearners; i++)
    learners.push(await createRandomUser("learner", courses, i))

  await User.insertMany(learners)
}

const createInstructors = async (numberOfInstructors) => {
  let instructors = []
  for (let i = 0; i < numberOfInstructors; i++)
    instructors.push(await createRandomUser("instructor", null, i))

  instructors = await User.insertMany(instructors)
  return instructors.map((instructor) => instructor._id)
}
const createCourses = async (numberOfCourses, instructorsIds) => {
  let courses = []
  let currentInstructorIndex = -1
  const coursesPerInstructor = Math.floor(
    numberOfCourses / instructorsIds.length
  )

  for (let i = 0; i < numberOfCourses; i++) {
    if (i % coursesPerInstructor == 0) currentInstructorIndex++
    courses.push(
      await createRandomCourse(
        instructorsIds[currentInstructorIndex],
        String.fromCharCode(97 + i)
      )
    )
  }
  courses = await Course.insertMany(courses)
  return courses.map((course) => course._id)
}

const createVideoActivities = async (courses, activitiesPerCourse) => {
  let activities = []
  for (const course of courses)
    for (let i = 0; i < activitiesPerCourse; i++)
      activities.push(createRandomVideoActivity(course))
  await VideoActivityModel.insertMany(activities)
}
;(async () => {
  const numberOfLearners = 10
  const numberOfInstructors = 3
  const numberOfCourses = 9
  const numberOfVideoActivitiesPerCourse = 3

  await connectDB()
  await dropDB()
  console.log("DB connected and dropped")

  //   create instructors
  const instructorsIds = await createInstructors(numberOfInstructors)
  console.log(`${numberOfInstructors} of instructor created`)

  //   create courses
  const coursesIds = await createCourses(numberOfCourses, instructorsIds)
  console.log(`${numberOfCourses} of courses created`)

  // create learners
  await createLearners(numberOfLearners, coursesIds)
  console.log(`${numberOfLearners} of learners created`)

  //   create video activities
  await createVideoActivities(coursesIds, numberOfVideoActivitiesPerCourse)
  console.log(
    `${numberOfVideoActivitiesPerCourse} video activities per each course`
  )

  await disconnectDB()
})()

// users => in / le => in : courses, le => courses, courses => questions => replies, courses => activities
