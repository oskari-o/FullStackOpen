const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    <Part
      part={parts[0]} 
    />
    <Part
      part={parts[1]} 
    />
    <Part
      part={parts[2]} 
    />      
  </>

const Course = ({ course }) => {
  const name = course.name
  return (
    <>
      <Header course={name} />
      {course.parts.map(part => 
        <Part key={part.id} part={part} />
      )}
      <Total sum={course.parts.reduce((acc, cur) => acc + cur.exercises, 0)} />
    </>
  )
}

export default Course