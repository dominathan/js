class Cell {
  constructor(props) {
    this.ctx = props.canvas.getContext('2d')
    this.top = props.top
    this.left = props.left
    this.width = props.width
    this.height = props.height
    this.row = props.row
    this.column = props.column
    this.rows = props.rows
    this.columns = props.columns
    this.position = { x: this.column, y: this.row }
    this.links = []
    this.uuid = Cell.guid()
  }

  drawCell() {
    // this.ctx.strokeRect(this.left, this.top, this.width, this.height)
  }

  clearEastWall() {
    const { ctx, left, width, top, height } = this
    // ctx.clearRect(left + width - 2, top + 1, 3, height - 2)
  }

  clearSouthWall() {
    const { ctx, left, width, top, height } = this
    // ctx.clearRect(left + 1, top + height - 2, width - 2, 3)
  }

  clearNorthWall() {
    const { ctx, left, width, top, height } = this
    // ctx.clearRect(left + 1, top - 1, width - 1, 3)
  }

  clearWestWall() {
    const { ctx, left, width, top, height } = this
    // ctx.clearRect(left - 2, top + 1, 3, height - 2)
  }

  clearWall(direction) {
    switch (direction) {
      case 'north':
        this.clearNorthWall()
        break
      case 'east':
        this.clearEastWall()
        break
      case 'south':
        this.clearSouthWall()
        break
      case 'west':
        this.clearWestWall()
        break
    }
  }

  link(cell, bidirectional = true) {
    if (!cell || this.isLinked(cell)) {
      return
    }
    this.links.push(cell)
    let direction = this.neighborDirection(cell)
    this.clearWall(direction)
    if (bidirectional) {
      cell.link(this)
    }
    return this.links
  }

  unlink(cell, bidirectional = true) {
    let uuids = this.links.map(cell => cell.uuid)
    this.links.splice(uuids.indexOf[cell.uuid], 1)
    return this.links
  }

  isLinked(cell) {
    return !!this.links.find(item => item.uuid === cell.uuid)
  }

  isEasternEdge() {
    return this.position.x + 1 === this.columns
  }

  isSouthernEdge() {
    return this.position.y + 1 === grid.rows
  }

  isNorthernEdge() {
    return this.position.y === 0
  }

  isWesternEdge() {
    return this.position.x === 0
  }

  color(color) {
    const { ctx, left, width, top, height } = this
    ctx.fillStyle = color
    // ctx.fillRect(left + 1, top + 1, width - 1, height - 1)
    ctx.fillRect(left, top, width, height)
  }

  colorWithDelay(color, index) {
    setTimeout(_ => {
      this.color(color)
    }, 1 * index)
  }

  text(word) {
    const { ctx, left, width, top, height } = this
    // this.ctx.clearRect(
    //   this.top + 1,
    //   this.left + 1,
    //   this.width - 1,
    //   this.height - 1
    // )

    ctx.font = `${(width / 2).toString()}px serif`
    ctx.fillText(word, left + width / 2, top + height / 2)
  }

  textWithDelay(word, index) {
    setTimeout(_ => {
      this.text(word)
    }, index * 1)
  }

  neighbors() {
    return ['east', 'west', 'north', 'south'].reduce((list, dir) => {
      if (this[dir]) {
        list.push(this[dir])
      }
      return list
    }, [])
  }

  neighborDirection(cell) {
    if (this.position.x > cell.position.x) {
      return 'west'
    } else if (this.position.x < cell.position.x) {
      return 'east'
    } else if (this.position.y < cell.position.y) {
      return 'south'
    } else {
      return 'north'
    }
  }

  distances(counter = 0) {
    console.time('DISTANCE')
    let distance = new Distances(this)
    let frontier = [this]
    while (frontier.length > 0) {
      let newFrontier = []

      frontier.forEach(cell => {
        cell.links.forEach(linked => {
          if (distance.cells[linked.uuid] !== undefined) {
            return
          }
          counter += 1
          distance.setDistance(
            linked.uuid,
            distance.currentDistance(cell.uuid) + 1
          )
          linked.distance = distance.currentDistance(linked.uuid)
          counter += 1
          // linked.text(distance.currentDistance(linked.uuid))
          // linked.textWithDelay(distance.currentDistance(linked.uuid), counter)
          newFrontier.push(linked)
        })
      })
      frontier = newFrontier
    }
    console.timeEnd('DISTANCE')
    return distance
  }

  drawLine(direction) {
    const { ctx, left, width, top, height } = this
    ctx.beginPath()
    ctx.strokeStyle = 'orange'
    ctx.moveTo(left + width / 2, top + height / 2)
    switch (direction) {
      case 'north':
        ctx.lineTo(left + width / 2, top - height / 2)
        break
      case 'east':
        ctx.lineTo(left + width / 2, top + height / 2)
        break
      case 'south':
        ctx.lineTo(left + width / 2, top + height / 2)
        break
      case 'west':
        ctx.lineTo(left - width / 2, top + height / 2)
        break
    }
    ctx.stroke()
    ctx.closePath()
  }

  drawLineWithDelay(direction, index) {
    setTimeout(() => {
      this.drawLine(direction)
    }, index * 1)
  }

  static guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
  }
}
