import React from 'react'
import { createRoot } from 'react-dom/client'
import { Hello } from './hello'

function Index() {
  console.log('index')
  return (
    <div className="index">
      <p>hello index</p>
      <Hello />
    </div>
  )
}

let container: HTMLElement

if (document.getElementById('container')) {
  container = document.getElementById('container') as HTMLElement
} else {
  container = document.createElement('div')
  container.id = 'container'
  document.body.appendChild(container)
}

const root = createRoot(container)
root.render(<Index />)
