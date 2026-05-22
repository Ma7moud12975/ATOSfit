import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../contexts/LanguageContext';

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const { isRTL, t } = useLanguage();

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef?.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const quickPrompts = [
    t('chat.promptBeginner'),
    t('chat.promptMeal'),
    t('chat.promptPrep'),
    t('chat.promptForm')
  ];

  return (
    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--bento-border)', backgroundColor: 'var(--bento-chip)' }}>
      
      {/* Quick Prompts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => !disabled && onSendMessage(prompt)}
            disabled={disabled}
            style={{
              background: 'var(--bento-chip)',
              border: '1px solid var(--bento-border)',
              color: 'var(--bento-muted)',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: disabled ? 0.5 : 1
            }}
            onMouseOver={e => { if(!disabled){ e.currentTarget.style.backgroundColor = 'rgba(255, 138, 0,0.1)'; e.currentTarget.style.color = '#FF8A00'; e.currentTarget.style.borderColor = 'rgba(255, 138, 0,0.3)'; } }}
            onMouseOut={e => { if(!disabled){ e.currentTarget.style.backgroundColor = 'var(--bento-chip)'; e.currentTarget.style.color = 'var(--bento-muted)'; e.currentTarget.style.borderColor = 'var(--bento-border)'; } }}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyPress}
            placeholder={t('chat.input')}
            disabled={disabled}
            rows={1}
            style={{
              width: '100%',
              backgroundColor: 'var(--bento-field)',
              border: '1px solid var(--bento-border)',
              borderRadius: '20px',
              padding: isRTL ? '1rem 1.25rem 1rem 3rem' : '1rem 3rem 1rem 1.25rem',
              color: 'var(--bento-text)',
              fontSize: '0.95rem',
              outline: 'none',
              resize: 'none',
              minHeight: '54px',
              maxHeight: '120px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              opacity: disabled ? 0.6 : 1
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#FF8A00'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 138, 0,0.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--bento-border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <button
            type="button"
            disabled={disabled}
            style={{ position: 'absolute', [isRTL ? 'left' : 'right']: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: isRecording ? '#FF8A00' : 'var(--bento-muted)', cursor: 'pointer' }}
          >
            <Icon name="Mic" size={20} />
          </button>
        </div>

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="btn-coral"
          style={{ 
            width: '54px', height: '54px', padding: 0, borderRadius: '50%', flexShrink: 0, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: (!message.trim() || disabled) ? 0.5 : 1,
            cursor: (!message.trim() || disabled) ? 'not-allowed' : 'pointer'
          }}
        >
          <Icon name="Send" size={20} color="#181818" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
