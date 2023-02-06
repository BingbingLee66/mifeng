export const RENDERER = {
  FIREWORK_INTERVAL_RANGE: { min: 10, max: 100 },
  SKY_COLOR: 'hsla(210, 60%, %luminance%, 0.1)',
  width: 0,
  height: 0,
  count: 20,
  FIREWORK_COUNT: 20,
  init() {
    // 判断是否第一次
    if (this.count < this.FIREWORK_COUNT) {
      this.stop()
      this.count = this.FIREWORK_COUNT
      this.setParameters()
      return
    }
    this.setParameters()
    this.reconstructMethod()
    this.render()
  },
  setParameters() {
    const container = document.getElementById('holidayPoster')
    this.width = container.clientWidth
    this.height = container.clientHeight
    const oldCanvas = document.getElementById('canvas')
    oldCanvas && oldCanvas.remove()
    this.distance = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2))
    const canvas = document.createElement('canvas')
    canvas.id = 'canvas'
    canvas.width = this.width
    canvas.height = this.height
    canvas.style.width = this.width + 'px'
    canvas.style.height = this.height + 'px'
    canvas.style.marginTop = '-233px'
    container.appendChild(canvas)
    this.contextFireworks = canvas.getContext('2d')
    this.setFireWork()
  },
  reconstructMethod() {
    this.render = this.render.bind(this)
  },
  getRandomValue(range) {
    return range.min + (range.max - range.min) * Math.random()
  },
  render() {
    requestAnimationFrame(this.render)
    let maxOpacity = 0
    const { contextFireworks } = this
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      maxOpacity = Math.max(maxOpacity, this.fireworks[i].getOpacity())
    }
    contextFireworks.globalCompositeOperation = 'destination-out'
    contextFireworks.fillStyle = this.SKY_COLOR.replace('%luminance', 5 + maxOpacity * 15)
    contextFireworks.fillRect(0, 0, this.width, this.height)
    contextFireworks.globalCompositeOperation = 'lighter'
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      if (!this.fireworks[i].render(contextFireworks)) {
        this.fireworks.splice(i, 1)
      }
    }
    if (--this.fireworkInterval === 0) {
      // 限制烟花数量
      if (this.count === 0) return
      this.setFireWork()
    }
  },
  setFireWork() {
    if (this.fireworks) this.fireworks.push(new FIREWORK(this.width, this.height, this))
    else this.fireworks = [new FIREWORK(this.width, this.height, this)]
    this.maxFireworkInterval = this.getRandomValue(this.FIREWORK_INTERVAL_RANGE) | 0
    this.fireworkInterval = this.maxFireworkInterval
    this.count--
  },
  stop() {
    this.count = 0
    this.fireworks = []
  }
}
var FIREWORK = function (width, height, renderer) {
  this.width = width
  this.height = height
  this.renderer = renderer
  this.init()
}
FIREWORK.prototype = {
  COLOR: 'hsl(%hue, 80%, 60%)',
  PARTICLE_COUNT: 1000,
  DELTA_OPACITY: 0.01,
  RADIUS: 5,
  VELOCITY: -10,
  WAIT_COUNT_RANGE: { min: 30, max: 60 },
  THRESHOLD: 50,
  DELTA_THETA: Math.PI / 10,
  GRAVITY: 0.002,

  init() {
    this.setParameters()
    this.createParticles()
  },
  setParameters() {
    var hue = (256 * Math.random()) | 0

    this.x = this.renderer.getRandomValue({ min: this.width / 8, max: (this.width * 7) / 8 })
    this.y = this.renderer.getRandomValue({ min: this.height / 20, max: this.height / 2 })
    this.x0 = this.x
    this.y0 = this.height + this.RADIUS
    this.color = this.COLOR.replace('%hue', hue)
    this.status = 0
    this.theta = 0
    this.waitCount = this.renderer.getRandomValue(this.WAIT_COUNT_RANGE)
    this.opacity = 1
    this.velocity = this.VELOCITY
    this.particles = []
  },
  createParticles() {
    for (var i = 0, length = this.PARTICLE_COUNT; i < length; i++) {
      this.particles.push(new PARTICLE(this.x, this.y, this.renderer))
    }
  },
  getOpacity() {
    return this.status === 2 ? this.opacity : 0
  },
  render(context) {
    switch (this.status) {
      case 0:
        context.save()
        context.fillStyle = this.color
        context.globalCompositeOperation = 'lighter'
        context.globalAlpha = this.y0 - this.y <= this.THRESHOLD ? (this.y0 - this.y) / this.THRESHOLD : 1
        context.translate(this.x0 + Math.sin(this.theta) / 2, this.y0)
        context.scale(0.8, 2.4)
        context.beginPath()
        context.arc(0, 0, this.RADIUS, 0, Math.PI * 2, false)
        context.fill()
        context.restore()
        this.y0 += this.velocity

        if (this.y0 <= this.y) {
          this.status = 1
        }
        this.theta += this.DELTA_THETA
        this.theta %= Math.PI * 2
        this.velocity += this.GRAVITY
        return true
      case 1:
        if (--this.waitCount <= 0) {
          this.status = 2
        }
        return true
      case 2:
        context.save()
        context.globalCompositeOperation = 'lighter'
        context.globalAlpha = this.opacity
        context.fillStyle = this.color

        for (
          let i = 0,
            {
              particles: { length }
            } = this;
          i < length;
          i++
        ) {
          this.particles[i].render(context, this.opacity)
        }
        context.restore()
        this.opacity -= this.DELTA_OPACITY
        return this.opacity > 0
    }
  }
}
var PARTICLE = function (x, y, renderer) {
  this.x = x
  this.y = y
  this.renderer = renderer
  this.init()
}
PARTICLE.prototype = {
  RADIUS: 3,
  VELOCITY_RANGE: { min: 3, max: 6 },
  GRAVITY: 0.02,
  FRICTION: 0.98,

  init() {
    const radian = Math.PI * 10 * Math.random()
    const velocity = (1 - Math.pow(Math.random(), 6)) * this.VELOCITY_RANGE.max
    const rate = Math.random()
    this.vx = velocity * Math.cos(radian) * rate
    this.vy = velocity * Math.sin(radian) * rate
  },
  render(context) {
    context.beginPath()
    context.arc(this.x, this.y, this.RADIUS, 0, Math.PI * 2, false)
    context.fill()

    this.x += this.vx
    this.y += this.vy
    this.vy += this.GRAVITY
    this.vx *= this.FRICTION
    this.vy *= this.FRICTION
  }
}
