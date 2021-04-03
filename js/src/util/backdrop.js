/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta3): util/backdrop.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler from '../dom/event-handler'
import { execute, getTransitionDurationFromElement, reflow, typeCheckConfig } from './index'

const Default = {
  isVisible: true, // if false, we use the backdrop helper without adding any element to the dom
  isAnimated: false,
  parentElem: document.body
}

const DefaultType = {
  isVisible: 'boolean',
  isAnimated: 'boolean',
  parentElem: 'element'
}
const NAME = 'backdrop'
const CLASS_NAME_BACKDROP = 'modal-backdrop'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

const EVENT_MOUSEDOWN = `mousedown.bs.${NAME}`

class Backdrop {
  constructor(config) {
    this._config = this._getConfig(config)
    this._isAppended = false
    this._element = null
  }

  onClick(callback) {
    this._clickCallback = callback
  }

  show(callback) {
    if (!this._config.isVisible) {
      execute(callback)
      return
    }

    if (this._config.isAnimated) {
      this._get().classList.add(CLASS_NAME_FADE)
    }

    this._append()

    if (this._config.isAnimated) {
      reflow(this._get())
    }

    this._get().classList.add(CLASS_NAME_SHOW)

    this._emulateAnimation(() => {
      execute(callback)
    })
  }

  hide(callback) {
    EventHandler.off(this._get(), EVENT_MOUSEDOWN)

    if (!this._config.isVisible) {
      execute(callback)
      return
    }

    this._get().classList.remove(CLASS_NAME_SHOW)

    this._emulateAnimation(() => {
      this.dispose()
      execute(callback)
    })
  }

  // Private

  _get() {
    if (!this._element) {
      const backdrop = document.createElement('div')
      backdrop.className = CLASS_NAME_BACKDROP
      this._element = backdrop
    }

    return this._element
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...(typeof config === 'object' ? config : {})
    }
    typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _append() {
    if (this._isAppended) {
      return
    }

    this._config.parentElem.appendChild(this._get())

    EventHandler.on(this._get(), EVENT_MOUSEDOWN, () => {
      execute(this._clickCallback)
    })

    this._isAppended = true
  }

  dispose() {
    EventHandler.off(this._get(), EVENT_MOUSEDOWN)
    if (!this._isAppended) {
      return
    }

    this._get().parentNode.removeChild(this._get())
    this._isAppended = false
  }

  _emulateAnimation(callback) {
    if (!this._config.isAnimated) {
      execute(callback)
      return
    }

    const backdropTransitionDuration = getTransitionDurationFromElement(this._get())
    setTimeout(() => execute(callback), backdropTransitionDuration)
  }
}

export default Backdrop
