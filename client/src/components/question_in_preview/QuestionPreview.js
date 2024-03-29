import React from 'react'
import PreviewStyle from './PreviewStyle.module.css'
import { useParams } from 'react-router-dom'

export default function QuestionPreview () {
  const { _id, type, questionIDinQuestionGroup } = useParams()
  const [questionData, setQuestionData] = React.useState({
    question: '',
    questionType: '',
    correctAnswer: '',
    choices: {
      choiceOne: '',
      choiceTwo: '',
      choiceThree: ''
    },
    explanation: ''
  })
  const [questionReference, setQuestionReference] = React.useState('')

  const [showExplanation, setShowExplanation] = React.useState(false)
  const [selected, setSelected] = React.useState('')
  const { question, questionType, correctAnswer, explanation } = questionData
  const [completeChoices, setCompletedChoices] = React.useState([])
  const [disableButton, setDisableButton] = React.useState(false)
  const [hasImageToLoad, sethasImageToLoad] = React.useState(false)

  const shuffleChoices = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }

  const selections = completeChoices.map(data => (
    <button
      className={PreviewStyle.btn_select}
      value={data}
      onClick={getAnswer}
      disabled={disableButton}
    >
      {data}
      {data === selected
        ? selected === correctAnswer
          ? '   correct'
          : '   incorrect'
        : ''}
    </button>
  ))

  React.useEffect(() => {
    async function getQuestion () {
      const response = await fetch(`http://localhost:5000/question/${_id}`)

      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`
        window.alert(message)
        return
      }

      const result = await response.json()

      setQuestionData(prev => {
        return { ...prev, ...result }
      })
      const randomChoices = [
        result.choices.choiceOne,
        result.choices.choiceTwo,
        result.choices.choiceThree,
        result.correctAnswer
      ]

      shuffleChoices(randomChoices)
      setCompletedChoices(randomChoices)
    }

    async function getQuestionInQuestionGroup () {
      const response = await fetch(
        `http://localhost:5000/grouped-question/${_id}`
      )

      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`
        window.alert(message)
        return
      }

      const result = await response.json()
      const questionGroup = result.questions
      const selectedQuestion = questionGroup.filter(
        question => question._id === questionIDinQuestionGroup
      )[0]

      const referenceType = result.referenceType

      if (referenceType === 'image') {
        sethasImageToLoad(true)
        setQuestionReference(result.imageUrlAsReference)
      } else {
        sethasImageToLoad(false)
        setQuestionReference(result.questionReference)
      }

      setQuestionData(prev => {
        return { ...prev, ...selectedQuestion }
      })
      const randomChoices = [
        selectedQuestion.choices.choiceOne,
        selectedQuestion.choices.choiceTwo,
        selectedQuestion.choices.choiceThree,
        selectedQuestion.correctAnswer
      ]
      shuffleChoices(randomChoices)
      setCompletedChoices(randomChoices)
    }

    if (type === 'ungroup') {
      getQuestion()
    } else if (type === 'group') {
      getQuestionInQuestionGroup()
    }

    return
  }, [])

  function getAnswer (event) {
    const selectedAnswer = event.target.value

    setShowExplanation(true)
    setSelected(selectedAnswer)

    setDisableButton(true)
    event.target.disableButton = false
  }

  return (
    <main className={PreviewStyle.bg}>
      <div className={PreviewStyle.container}>
        <div className={PreviewStyle.flex_start}>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 'bolder',
              opacity: '0.7'
            }}
          >
            {questionType}
          </p>
        </div>

        <div className='flex flex-center'>
          {hasImageToLoad === true ? (
            <img
              src={`${questionReference}`}
              alt='question reference'
              style={{
                width: '30%'
              }}
            />
          ) : (
            <p style={{whiteSpace: "pre-line"}}>{questionReference}</p>
          )}
        </div>
        <div
          className={`${PreviewStyle.flex_center} ${PreviewStyle.question_text}`}
          style={{
            marginBottom: '20px'
          }}
        >
          <p style={{ marginTop: '40px', marginBottom: '20px', whiteSpace: "pre-line" }}>{question}</p>
        </div>
        <div className={`${PreviewStyle.flex_center}`}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '30px'
            }}
          >
            {selections}
          </div>
        </div>
        {showExplanation && (
          <div className={PreviewStyle.explanation_container}>
            <p
              style={{
                fontWeight: 'bolder'
              }}
            >
              Explanation
            </p>
            <p style={{whiteSpace: "pre-line"}} >{explanation}</p>
          </div>
        )}
      </div>
    </main>
  )
}
