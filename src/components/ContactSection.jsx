import React, { useState } from 'react'
import { sendContact } from '../api/api.js'

function ContactSection() {
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return
    const formEl = event.currentTarget
    const formData = new FormData(event.currentTarget)
    const payload = {
      name: (formData.get('name') || '').toString().trim(),
      email: (formData.get('email') || '').toString().trim(),
      subject: (formData.get('subject') || '').toString().trim(),
      message: (formData.get('message') || '').toString().trim()
    }

    try {
      setIsSubmitting(true)
      setStatus({ state: 'loading', message: 'Sending...' })
      await sendContact(payload)
      if (formEl && typeof formEl.reset === 'function') {
        formEl.reset()
      }
      setStatus({ state: 'success', message: 'Message sent successfully!' })
    } catch (error) {
      console.error('Contact form error:', error)
      setStatus({
        state: 'error',
        message: error?.message || 'Unable to send message.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id='contact' className='glass-panel contact-panel scroll-target flex flex-col gap-8 p-8 md:flex-row md:items-start'>
      <div className='contact-copy flex-1 space-y-4'>
        <p className='text-xs uppercase tracking-[0.4em] text-cyan-200/80'>
          Contact
        </p>
        <h2 className='text-3xl font-semibold text-white'>Signal the archive</h2>
        <p className='text-sm text-slate-200/90 md:text-base'>
          Share mission notes, propose a story, or request a featured transmission. We answer within
          one orbital cycle.
        </p>
        <div className='contact-grid'>
          <div>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-300'>Station</p>
            <p className='mt-2 text-sm text-slate-200/80'>Deep Space Relay 07</p>
          </div>
          <div>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-300'>Frequency</p>
            <p className='mt-2 text-sm text-slate-200/80'>+91 8925005817</p>
          </div>
          <div>
            <p className='text-sm uppercase tracking-[0.3em] text-slate-300'>Channel</p>
            <p className='mt-2 text-sm text-slate-200/80'>ykyokeshwaran@gmail.com</p>
          </div>
        </div>
      </div>

      <form className='contact-form flex-1 space-y-4' onSubmit={handleSubmit}>
        <div className='contact-field'>
          <label htmlFor='contact-name' className='contact-label'>
            Name
          </label>
          <input id='contact-name' name='name' type='text' className='contact-input' placeholder='Crew member' />
        </div>
        <div className='contact-field'>
          <label htmlFor='contact-email' className='contact-label'>
            Email
          </label>
          <input
            id='contact-email'
            name='email'
            type='email'
            className='contact-input'
            placeholder='signal@orbitlogs.space'
          />
        </div>
        <div className='contact-field'>
          <label htmlFor='contact-subject' className='contact-label'>
            Subject
          </label>
          <input
            id='contact-subject'
            name='subject'
            type='text'
            className='contact-input'
            placeholder='Transmission request'
          />
        </div>
        <div className='contact-field'>
          <label htmlFor='contact-message' className='contact-label'>
            Message
          </label>
          <textarea
            id='contact-message'
            name='message'
            rows='4'
            className='contact-input contact-textarea'
            placeholder='Share the coordinates for your story...'
          />
        </div>
        {status.state !== 'idle' && (
          <p className={`contact-status ${status.state}`}>
            {status.message}
          </p>
        )}
        <button
          type='submit'
          className='glass-pill px-6 py-2 text-sm font-medium'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send signal'}
        </button>
      </form>
    </section>
  )
}

export default ContactSection
