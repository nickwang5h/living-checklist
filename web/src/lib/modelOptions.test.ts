import test from 'node:test'
import assert from 'node:assert/strict'
import { getDefaultModel, getModelOptions, isKnownModel, CUSTOM_MODEL_VALUE } from './modelOptions'

test('returns provider-specific model options and defaults', () => {
  assert.deepEqual(getModelOptions('openai').map((option) => option.value), ['gpt-5.5', 'gpt-5.4', 'gpt-5.4-mini'])
  assert.equal(getDefaultModel('anthropic'), 'claude-sonnet-5')
  assert.equal(getDefaultModel('gemini'), 'gemini-3.5-flash')
})

test('recognizes custom and preset models correctly', () => {
  assert.equal(isKnownModel('openai', 'gpt-5.4-mini'), true)
  assert.equal(isKnownModel('openai', 'gpt-4o-mini'), false)
  assert.equal(isKnownModel('custom', 'gpt-5.4-mini'), true)
  assert.equal(isKnownModel('custom', CUSTOM_MODEL_VALUE), false)
})
