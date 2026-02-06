const homeScreen = document.getElementById('home-screen')
const gameScreen = document.getElementById('game')
const playBtn = document.getElementById('play-btn')
const aboutBtn = document.getElementById('about-btn')
const aboutText = document.getElementById('about-text')



const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')
const backgroundElement = document.querySelector('.background')
const containerElement = document.querySelector('.container')

playBtn.addEventListener('click', async () => {
  homeScreen.classList.add('hidden')
  gameScreen.classList.remove('hidden')
  startGame()


})

aboutBtn.addEventListener('click', () => {
  aboutText.classList.toggle('hidden')
})

function goHome() {

  ambience.pause()
  ambience.currentTime = 0
  ambience.src = ""
  currentSceneClass = null

  
  gameScreen.classList.add('hidden')
  homeScreen.classList.remove('hidden')

  aboutText.classList.add('hidden')
}



const SCENE_AUDIO = {
  "bg-1": "audio/driving.mp3",
  "bg-12": "audio/speed.mp3",
  "bg-2": "audio/forest.mp3",
  "bg-3": "audio/forest.mp3",
  
}

let ambience = new Audio()
ambience.loop = true
ambience.volume = 0.4
let currentSceneClass = null




// DRAMATIC PAUSE
function wait(ms) {
  return new Promise(res => setTimeout(res, ms))
}

async function playBlackoutSFX({ sfx, volume = 0.8, ms = 1200 }) {
  
  backgroundElement.classList.add('blackout')
  containerElement.style.visibility = 'hidden'

  playSFX(sfx, volume)

  
  await wait(ms)


  containerElement.style.visibility = 'visible'
  backgroundElement.classList.remove('blackout')
}


let state = {}

function startGame() {
    state = {}
    showTextNode(1)
}

// ambience
function setAmbienceForScene(sceneClass) {
  
  if (sceneClass === currentSceneClass) return
  currentSceneClass = sceneClass

  const src = SCENE_AUDIO[sceneClass]

  if (!src) {
    ambience.pause()
    ambience.src = ""
    return
  }

 
  if (ambience.src.includes(src)) return

  ambience.pause()
  ambience.src = src
  ambience.currentTime = 0
  ambience.play().catch(() => {
    
  })
}

// SFX
function playSFX(src, volume = 0.7) {
  const sfx = new Audio(src)
  sfx.volume = volume
  sfx.play().catch(() => {})
}


// Tyoewriter Effect
let typingTimer = null

function typeText(element, text, speed = 25) {
  if (typingTimer) clearInterval(typingTimer)

  element.textContent = ""
  let i = 0

  return new Promise(resolve => {
    typingTimer = setInterval(() => {
      element.textContent += text[i]
      i++
      if (i >= text.length) {
        clearInterval(typingTimer)
        resolve()
      }
    }, speed)
  })
}



// Timing
async function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === 
    textNodeIndex)
    // bg change 
   backgroundElement.className = "background"
if (textNode.backgroundClass) backgroundElement.classList.add(textNode.backgroundClass)

    containerElement.classList.remove('speaker-wolf')

    if (textNode.speaker === 'wolf') {
  containerElement.classList.add('speaker-wolf')
    }



    while (optionButtonsElement.firstChild) {
  optionButtonsElement.removeChild(optionButtonsElement.firstChild)
    }
        
    setAmbienceForScene(textNode.backgroundClass)

    if (textNode.blackout) {
     await playBlackoutSFX({
      sfx: textNode.blackoutSfx,
      ms: textNode.blackoutMs ?? 1200
     })


    
    } else if (textNode.sfx) {
    playSFX(textNode.sfx, 0.5)
    }   
    
    const speed = textNode.typingSpeed ?? 25
    await typeText(textElement, textNode.text, speed)


    textNode.options.forEach(option => {
        if (showOption(option)) {
        const button = document.createElement('button')
        button.innerText = option.text
        button.classList.add('btn')
        button.addEventListener('click', () => selectOption(option))
        optionButtonsElement.appendChild(button)

        }
    })

}

function showOption(option) {
    return  option.requiredState == null  ||  option.requiredState(state)
}

function selectOption(option) { 
    const nextTextNodeId = option.nextText

    if (nextTextNodeId === 0) {
        goHome()
        return
  }

    if (nextTextNodeId <= 0) {
         startGame( )
         return
    }
    state = Object.assign (state, option.setState)
    showTextNode(nextTextNodeId)

}

// Narrative Starts Here

const textNodes =  [

    {
        id: 1,
        backgroundClass: 'bg-1',
        text: 'Its been a long night but you decided to drive home despite the risk.',
        options: [
            {
                text: '...',
                setState: { checkPhone: true},
                nextText: 2
            },
            {
            text: 'I.. should stop driving',
            nextText: 4
            }

        ]
    
    },



    {

    id: 2,
        backgroundClass: 'bg-1',
        text: 'Perhaps drinking was not the best idea, but being in bed sure does sound like one.',
        options: [
            {
                text: 'I need to get home.',
                requiredState: (currentState)  => currentState.checkPhone,
                setState: { checkPhone: false},
                nextText: 3
            },
            {
            text: 'I.. should stop driving.',
            nextText: 4
            }
        ]
    },
    {
    
        id: 3,
            backgroundClass: 'bg-12',
            text: 'Getting tired of the slow commute you decide to hit the gas pedal.',
            options: [
                {

                 text: 'This is fun', 
                 nextText: 5

                }
            
        ]
    },


    {
        id: 4, 
        backgroundClass: 'fade-black',
        sfx: 'audio/stopping.mp3',
        text: 'You decided that drunk driving is actually stupid and pulled over to sleep the booze off. Who knows what trouble you may get into otherwise...',
        options: [
            {
                text: 'Who knows...',
                nextText: 45
            }
        ]
    },

    {
        id: 45, 
        backgroundClass: 'ending1',
        text: 'Restart?',
        options: [
            {
                text: 'Yes',
                nextText: -1
            },

            {
                text: 'No',
                nextText: 0,
            }

        ]
    },

    {

        id: 5,
        backgroundClass: 'bg-12',
        text: 'You can feel your blood starting to pump harder as your car rapidly accelatated on the road.',
        options: [
            {
                text: 'I feel alive',
                nextText: 6
            },

            { 
                text: 'This is a bad idea, actually.',
                nextText: 4
            }
        ]

    },

    {
        id: 6, 
        backgroundClass: 'bg-12',
        text: 
            'Your hands grip the steering wheel, foot flattening the throttle.',

        options: [
            {
                text: 'Keep going',
                nextText: 7
            },

            {
                text: "Stop",
                nextText: 4
            }
        ]
            
        

                

    },

    {
    id: 7, 
    backgroundClass: 'bg-12',
    text: 'Man and machine become one. Nothing can stop you.',
                
        options: [
            {
            text: 'Do not stop',
            nextText: 8 
            }
        ]

    },

     {
    id: 8, 
    backgroundClass: 'bg-12',
    typingSpeed: 80,
    text: 'Nothing at al-',
                
        options: [
            {
            text: '!!!',
            nextText: 9 
            }
        ]

    },
    {
    id: 9, 
     backgroundClass: 'fade-black',
     blackout: true,
     blackoutSfx: 'audio/crash.mp3',
     blackoutMs: 5000,
     typingSpeed: 100,
     text: '...',

        options: [
            {
                text: '...',
                nextText: 10
            }

        ]
     
     


    },

    {
        id: 10, 
        backgroundClass: 'fade-black',
        typingSpeed: 100,
        text: 'Oh no...',

        options: [
            {
                text: 'I just hit something, didnt I?',
                nextText: 11
            }
        ]
    },

    {
        id: 11,
        backgroundClass: 'fade-black',
        text: 'You absolutely hit something', 

        options: [
            {
                text: 'Shit.',
                nextText: 12
            }
        ]
    },

    {
        id: 12, 
        backgroundClass: 'fade-black',
        text: 'What are you gonna do now, dumbass?',

        options: [
            {
                text: 'Leave the car to inspect',
                nextText: 13


            },

            {
                text: 'That can wait. Smoke a cig.',
                nextText: 14
            }
        ]
    },

    {
        id: 13,
        backgroundClass: 'fade-black',
        sfx: 'audio/door.mp3',
        text: 'the cold breeze of the forest crawls under your skin.',

        options: [
            {
                text: '*shudders*',
                nextText: 16
            }
        ]
    },


    {
        id: 14,
        backgroundClass: 'fade-black',
        sfx: 'audio/cig.mp3',
        text: 'You decided that what ever is suffering out there can wait.',

        options: [
            {
                text: 'I am the one suffering the most here.',
                nextText:15
            }
        ]
    },

    {
        id: 15, 
        backgroundClass: 'fade-black',
        blackout: true,
        blackoutMs: 3000,
        typingSpeed: 70,
        text: 'This tastes horrible actually...',

        options: [
            {
                text: 'Stub it out and leave the car.',
                nextText: 16
            }
        ]
    },

    {
        id: 16, 
        backgroundClass: 'bg-2',
        text: 'The dim headlights on your shitty car make it hard to make out the road ahead of you.',

        options: [
            {
                text: 'Squint eyes',
                nextText: 17
            }
        ]
    },

    {
        id: 17, 
        backgroundClass: 'bg-2',
        text: 'You can barely make out a small figure on the road a couple of yards ahead of you',

        options: [
            { 
                text: 'Move closer',
                nextText: 19

            },

            {
                text: 'Call out to it',
                nextText: 18
            }
        ]
    },

    {
        id: 18, 
        backgroundClass: 'bg-2',
        text: 'Your voice cracked in the silence of the woods as you shouted a shrill "hello"... But you get no answer.',

        options: [
            {
                text: 'Move closer',
                nextText: 19
            }
        ]

    },

    {
        id: 19,
        backgroundClass: 'bg-3',
        typingSpeed: 70,
        text: '...',

        options: [
            {
                text: 'oh my god',
                nextText: 20
            }
        ]
    },

    {
        id: 20,
        backgroundClass: 'bg-3',
        text: 'Great, and its still alive too. what will you do?',

        options: [
            {
                text: 'Put it out of its misery',
                nextText: 21
            },

            {
                text: 'Leave it to die alone',
                nextText: 22
            }

        ]
    },

    {
        id: 21,
        backgroundClass: 'bg-3',
        text: 'Sometimes the right choices come with sacrifice.',

        options: [
            {
                text: 'Get the gun in the glovebox',
                nextText: 23
            }
        ]
    },

    {
        id: 22,
        backgroundClass: 'fade-black',
        text: 'Wracked with guilt, you quickly left the scene in your car, never looking back again. Youd rather not finish what youve started.',

        options: [
            {
                text: 'Id rather not...',
                nextText: 225
            }
        ]
    },

      {
        id: 225,
        backgroundClass: 'ending1',
        text: 'Restart?',

        options: [
            {
                text: 'Yes',
                nextText: -1
            },

            {
                text: 'No',
                nextText: 0
            }
        ]
    },

    {
        id: 23,
        backgroundClass: 'fade-black',
        sfx: 'audio/gun.mp3',
        text: 'You always kept your gun in the case of a desperate situation. But you were not prepared for this one. ',

        options: [
            {
                text: 'lets do this',
                nextText: 24
            },

            {
                text: 'Ive changed my mind',
                nextText: 22
            }
        ]
    },


    {
        id: 24,
        backgroundClass: 'bg-3',
        text: 'The poor creature still lays still.',

        options: [
            {
                text: 'aim for the head',
                nextText: 25
            },

            {
                text: 'aim for the heart',
                nextText: 25
            }
        ]
    },

    // i wish i was that dawg frfr 

    {
        id: 25,
        backgroundClass: 'bg-3',
        speaker: 'wolf',
        typingSpeed: 80,
        text: 'WAIT! ! ! PL E A SE DON T  SH OOT...',

        options: [
            {
                text: 'You didnt hear anything. Shoot it.',
                nextText: 26
            },

            {
                text: 'Dont shoot.',
                nextText: 27
            }
        ]
    },

    {
        id: 26,
        backgroundClass: 'fade-black',
        blackout: true,
        blackoutSfx: 'audio/shot.mp3',
        blackoutMs: 5000, 
        typingSpeed: 80,
        text: 'It is done. ',

        options: [
            {
                text: 'go home',
                nextText: 28
            }

        ]
    },

    {
        id: 28,
        backgroundClass: 'ending2',
        typingSpeed: 80,
        text: 'Restart?',

        options: [
            {
                text: 'Yes',
                nextText: -1
            },

            {
                text: 'No',
                nextText: 0
            }
        ]
    },



    



]





