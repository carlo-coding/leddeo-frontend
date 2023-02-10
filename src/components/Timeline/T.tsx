export default function TimeLine({
  canvas,
  canvas2,
  alignments,
  endTime,
  getPlayer,
  changeAlignment,
  changeZoomLevel,
  changeShift,
  setCurrentPrtcl,
  options,
  zoomLevel,
  shift,
  currentPrtcl,
}: {
  canvas: any;
  canvas2: any;
  alignments: any;
  endTime: any;
  getPlayer: any;
  changeAlignment: any;
  changeZoomLevel: any;
  changeShift: any;
  setCurrentPrtcl: any;
  options: any;
  zoomLevel: any;
  shift: any;
  currentPrtcl: any;
}) {
  // constants
  const LINE_HEIGHT = 40;
  const TRACK_HEIGHT = 40;
  const TIME_BAR_MARGIN = 17;
  const TIMELINE_HEIGHT = 100;
  const RESIZE_MODE_EDGE = 10;
  const SHIFT_SCALE = Math.E;
  const EXRTA_SHIFT = 60;
  const ZOOM_SCALE = 1.35;
  const MINIMUM_BLOCK_TIME = 4;
  const SCROLL_BAR_HEIGHT = 20; // colors

  const SELECTED_COLOR = options.colors.selectedBox;
  const ACTIVE_COLOR = options.colors.boxHover;
  const CURSUR_TIME_CONTAINER_COLOR = options.colors.playingBox;
  let scrolling = false;
  let autoScroll = options.autoScroll;
  let maximumShift = 10000;
  let isMouseDown = false;

  if (!canvas || !canvas2 || !alignments) {
    return;
  } // element setting

  let animationID: any;
  let w =
    (canvas.width =
    canvas2.width =
      canvas.parentElement.parentElement.clientWidth);
  let h = (canvas.height = canvas2.height = TIMELINE_HEIGHT);
  let scrollPosition = 0;
  let scrollSize = w;
  let minimumZoomLevel = w / endTime;
  let ctx = canvas.getContext("2d");
  let bgCtx = canvas2.getContext("2d");
  ctx.lineWidth = 2;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "10px Arial";
  canvas.style.backgroundColor = "transparent";
  canvas2.style.backgroundColor = options.colors.background;
  let mouse: any = {};
  let lastXcursor = 0;
  let mouseTime: any;
  let swaping = false;
  let player: any;
  let movingDirection: any;
  let moving = false;
  let resizing = false;
  let currentHoveredIndex = -1;
  let currentPrtclsIndex: any;
  let rightResize = false;
  let leftResize = false;
  let globalRatio = 1;
  let currentTime = 0;
  let beginingTimeShow = 0;
  let endTimeShow = Math.abs(w + shift) / zoomLevel;
  let moveIndex: any;
  let newTime: any;
  let prtcls: any = [];
  let stopMove = false;

  setData(alignments); //tooltip

  var tooltipTimeout: any;
  var visibleTooltip = false;
  let visitedPrtcl: any; // BEGIN ...

  addListenerHandlers(canvas);
  changeZoomLevel(zoomLevel);
  drawBG(bgCtx);
  animate(); // HELPERS ...

  function Square(
    this: any,
    x: any,
    y: any,
    edge: any,
    index: any,
    text: any,
    sIndex: any,
    eIndex: any,
    id: any
  ) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.edge = edge;
    this.startIndex = sIndex;
    this.endIndex = eIndex;
    this.selected = false;
    this.active = false;
    this.index = index;
    this.id = id;

    this.draw = (context: any) => {
      context.save();
      context.fillStyle = ACTIVE_COLOR;

      if (currentHoveredIndex !== this.index) {
        context.fillStyle = options.colors.box;
      }

      if (this.active) {
        context.fillStyle = ACTIVE_COLOR;
      }

      if (this.selected) {
        context.fillStyle = SELECTED_COLOR;
      }

      context.fillRect(this.x + shift, this.y, this.edge, TRACK_HEIGHT);
      context.beginPath();
      context.strokeStyle = "#888888";
      context.lineWidth = 1;
      context.moveTo(this.x + shift - 1 + this.edge, this.y + 1);
      context.lineTo(this.x + shift - 1 + this.edge, this.y + TRACK_HEIGHT);
      context.closePath();
      context.stroke();
      ctx.font = "0.3em Arial";
      context.fillStyle = options.colors.text;
      if (this.selected) context.fillStyle = options.colors.selectedText;
      let space = this.edge;
      var rat = ctx.measureText(this.text).width / space;
      let trimedText =
        rat <= 1
          ? this.text
          : this.text.substr(0, Math.floor((1 / rat) * this.text?.length) - 1);
      if (trimedText && this.edge > 20)
        ctx.fillText(
          trimedText,
          this.x + 1 + shift,
          this.y + 22,
          this.edge - 2
        );
      context.restore();
    };
  }

  function getMouseCoords(canvas: any, event: any) {
    let canvasCoords = canvas.getBoundingClientRect();
    let yy = event.pageY - canvas.offsetTop;
    let xx = event.pageX - canvas.offsetLeft;
    let xxxx = event.pageX - canvasCoords.x;
    let yyyy = event.pageY - canvasCoords.y - window.pageYOffset;
    return {
      x: xxxx,
      y: yyyy,
    };
  }

  function getOffsetCoords(mouse: any, rect: any) {
    return {
      x: mouse.x - rect.x,
      y: mouse.y - rect.y,
    };
  }

  function cursorInRect(
    mouseX: any,
    mouseY: any,
    rectX: any,
    rectY: any,
    rectW: any
  ) {
    let xLine = mouseX > rectX + shift && mouseX < rectX + shift + rectW;
    let yLine = mouseY > rectY && mouseY < rectY + TRACK_HEIGHT;
    return xLine && yLine;
  }

  function resize() {
    w =
      canvas.width =
      canvas2.width =
        canvas.parentElement.parentElement.clientWidth;
    h = canvas.height = canvas2.height = TIMELINE_HEIGHT;
    drawBG(bgCtx);
  }

  function changeZoom(deltaY: any) {
    handleZoom({
      deltaY,
    });
  }

  function handleZoom(e: any) {
    try {
      e.preventDefault();
    } catch (error) {}

    if (resizing) return;
    let originalZoomLevel = zoomLevel;
    let originalMouseTime = mouseTime;
    let viewPortTime = endTimeShow - beginingTimeShow;

    if (e.deltaY < 0) {
      if (zoomLevel * ZOOM_SCALE < 500) zoomLevel *= ZOOM_SCALE;
    } else {
      if (zoomLevel / ZOOM_SCALE <= minimumZoomLevel) {
        zoomLevel = minimumZoomLevel;
      } else {
        if (viewPortTime < endTime) {
          zoomLevel /= ZOOM_SCALE;
        }
      }
    }

    let newMouseTime = (mouse.x - shift) / zoomLevel;
    let newShift = (originalMouseTime - newMouseTime) * zoomLevel;

    if (shift - newShift > 0) {
      shift = 0;
    } else {
      shift = shift - newShift;
    }

    let ratio = 1;
    prtcls.forEach((p: any) => {
      let px = p.x;
      let originalPX = p.x / originalZoomLevel;
      let originalEdge = p.edge / originalZoomLevel;
      p.edge = originalEdge * zoomLevel;
      p.x = originalPX * zoomLevel;
      ratio = p.x / px;
    });
    checkShift();
    changeZoomLevel(zoomLevel);
    drawBG(bgCtx, ratio);
  }

  function drawTimeCursor() {
    let position = currentTime * zoomLevel + shift;
    let context = ctx;
    let pos = position !== undefined ? position : mouse ? mouse.x : undefined;
    if (pos === undefined) return; //temporary deactive hover cursor
    // currentHoveredIndex = prtcls.findIndex(
    //   (e) => pos - shift >= e.x && pos - shift <= e.x + e.edge
    // );

    context.save();
    context.fillStyle = CURSUR_TIME_CONTAINER_COLOR;
    context.fillRect(pos - 70, 21, 70, 17);
    context.fillStyle = "white";
    context.fillText(toTime((pos - shift) / zoomLevel, true), pos - 60, 30);
    context.lineWidth = 4;
    context.strokeStyle = CURSUR_TIME_CONTAINER_COLOR;
    context.beginPath();
    context.moveTo(pos, 0);
    context.lineTo(pos, 150);
    context.closePath();
    context.stroke();
    context.restore();
  }

  function mousemoveGeneral(e: any) {
    e.preventDefault();
    mouse = getMouseCoords(canvas, e);

    if (lastXcursor < mouse.x) {
      movingDirection = "right";
    } else {
      movingDirection = "left";
    }

    lastXcursor = mouse.x;

    if (!moving && !resizing && !swaping && !scrolling) {
      // activePrtcl();
      checkResizing();
      hoverElement();
    }
  }

  function handleHoverTimeBar() {
    if (mouse.y < TIME_BAR_MARGIN) {
      canvas.classList.add("crosshair");
    } else {
      canvas.classList.remove("crosshair");
    }
  }

  function handleMouseMove(e: any) {
    e.preventDefault();
    handleHoverTimeBar();
    if (!currentPrtcl) visibleTooltip = false;
    if (moving) {
      handleMoving();
    } else if (resizing) {
      handleResize(mouse);
    } else if (scrolling) {
      handleScrolling();
    } else if (swaping) {
      resetActives();
      handleVerticalSwipe(e.movementX);
    } else if (isMouseDown) {
      moving = true;
    } else {
      resetActives();
    }

    if (moving || scrolling || swaping) checkShift();
    drawBG(bgCtx);
  }
  function handleScrolling() {
    if (zoomLevel === minimumZoomLevel) return;

    // let mouseDistancetToScroll = Math.abs(mouse.x - scrollPosition);
    let distance = scrollSize / 2;
    let ratio = (mouse.x - distance) / w;
    let value = -1 * ratio * endTime * zoomLevel;
    if (value <= 0) shift = value;
    drawBG(bgCtx);
  }
  function resetActives() {
    // prtcls.forEach((d) => {
    //   d.active = false;
    // });
  }
  function handleMoving() {
    if (!currentPrtcl) return;
    let min = 0;
    let max = 99999999;
    let leftSub = prtcls[currentPrtclsIndex - 1];
    let rightSub = prtcls[currentPrtclsIndex + 1];
    if (leftSub) min = leftSub.x + leftSub.edge;
    if (rightSub) max = rightSub.x;

    let pos = mouse.x - (currentPrtcl.offset?.x || 0);

    if (pos + currentPrtcl.edge <= max && pos >= min) {
      currentPrtcl.x = pos;
      currentPrtcl.y = LINE_HEIGHT;
    } else {
      if (
        movingDirection === "right" &&
        pos > currentPrtcl.x + currentPrtcl.edge
      )
        currentPrtcl.x = max - currentPrtcl.edge;
      if (movingDirection === "left" && pos < currentPrtcl.x)
        currentPrtcl.x = min;
    }
  }
  function outPrtcls() {
    let data = prtcls.map((p: any, i: number) => {
      let begin = p.x / zoomLevel;
      let end = (p.x + p.edge) / zoomLevel;
      let text = p.text;

      if (prtcls[i + 1]) {
        let nextStart = prtcls[i + 1].x / zoomLevel;
        if (nextStart < end) end = nextStart;
      }
      const id = p.id ? p.id : Math.random().toString().slice(2);

      return {
        id,
        begin,
        end,
        text,
      };
    });
    changeAlignment(data);
  }

  function handleVerticalSwipe(movementX: number = 0) {
    if (swaping && zoomLevel !== minimumZoomLevel) {
      if (movingDirection === "left") {
        if ((w - shift) / zoomLevel > endTime + EXRTA_SHIFT) return;
        shift = shift + SHIFT_SCALE * movementX;
      } else if (movingDirection === "right") {
        if (shift + SHIFT_SCALE > 0) {
          shift = 0;
        } else {
          shift = shift + SHIFT_SCALE * movementX;
        }
      }

      drawBG(bgCtx);
    }
  }

  function calculateViewPortTimes() {
    beginingTimeShow = Math.abs(shift) / zoomLevel;
    endTimeShow = Math.abs(w - shift) / zoomLevel;
    mouseTime = (mouse.x - shift) / zoomLevel;
    changeShift(shift);
  }

  function handleDbClick() {
    if (currentPrtcl) {
      // [TODO]: Volver a usar este if, manejando todas las variables como un estado
      /* if (
        cursorInRect(
          mouse.x,
          mouse.y,
          currentPrtcl.x,
          currentPrtcl.y,
          currentPrtcl.edge
        )
      ) {
        currentPrtcl.selected = true;
        currentPrtcl.offset = getOffsetCoords(mouse, currentPrtcl);
        player.currentTime = currentPrtcl.x / zoomLevel;
        player.play();
      } else {
        currentPrtcl.selected = false;
      } */
      currentPrtcl.selected = true;
      currentPrtcl.offset = getOffsetCoords(mouse, currentPrtcl);
      player.currentTime = currentPrtcl.x / zoomLevel;
      player.play();
    }
  }

  function handleCursor() {
    // if (swaping) {
    //   canvas.classList.add("grabbing");
    // } else {
    //   canvas.classList.remove("grabbing");
    // }
    // if (currentPrtcl) {
    //   canvas.classList.add("move");
    // } else {
    //   canvas.classList.remove("move");
    // }
  }

  function handleMouseDown() {
    isMouseDown = true;

    if (rightResize || leftResize) {
      resizing = true;
      handlePauseInChanging();
    }

    if (currentPrtcl) {
      if (
        cursorInRect(
          mouse.x,
          mouse.y,
          currentPrtcl.x,
          currentPrtcl.y,
          currentPrtcl.edge
        )
      ) {
        currentPrtcl.selected = true;
        currentPrtcl.offset = getOffsetCoords(mouse, currentPrtcl);

        if (resizing) {
          handlePauseInChanging();
        }
      } else {
        currentPrtcl.selected = false;
      }
    } else if (!resizing) {
      if (mouse.y < TIME_BAR_MARGIN) {
        // Ir a un momento especifico del timeline dando click en el margin
        player.currentTime = (mouse.x - shift) / zoomLevel;
      } else if (
        mouse.y > TIME_BAR_MARGIN &&
        mouse.y < TIMELINE_HEIGHT - SCROLL_BAR_HEIGHT
      ) {
        // Hacer scroll haciendo drag en la linea de tiempo
        swaping = true;
      } else if (mouse.y > TIMELINE_HEIGHT - SCROLL_BAR_HEIGHT) {
        // Mover el scroll a un punto especifico
        let distance = scrollSize / 2;
        let ratio = (mouse.x - distance) / w;
        let value = -1 * ratio * endTime * zoomLevel;
        if (value <= 0) shift = value;
        drawBG(bgCtx);
      }
    }
  }

  function handlePauseInChanging() {
    if (player) {
      // player.pause();
    }
  }

  function mouseup() {
    isMouseDown = false;
    canvas.classList.remove("col-resize");

    if (resizing) {
      // player.play();
    }

    if (moving) {
      // player.play();
    }

    resizing = false;
    moving = false;
    swaping = false;
    stopMove = false;
    prtcls.forEach((e: any) => (e.selected = false));
    if (currentPrtcl) currentPrtcl.active = true;
    outPrtcls();
  }

  function checkResizing() {
    if (currentPrtcl) {
      if (
        mouse.x >=
          currentPrtcl.x + shift + currentPrtcl.edge - RESIZE_MODE_EDGE &&
        mouse.x <= currentPrtcl.x + shift + currentPrtcl.edge
      ) {
        rightResize = true;
        canvas.classList.add("col-resize");
      } else if (
        mouse.x <= currentPrtcl.x + shift + RESIZE_MODE_EDGE &&
        mouse.x >= currentPrtcl.x + shift
      ) {
        leftResize = true;
        canvas.classList.add("col-resize");
      } else {
        leftResize = false;
        rightResize = false;
        canvas.classList.remove("col-resize");
      }
    } else {
      leftResize = false;
      rightResize = false;
      canvas.classList.remove("col-resize");
    }
  }

  function setTooltipTimeout() {
    visibleTooltip = true;
    visitedPrtcl = -1;
  }

  function hoverElement() {
    if (currentPrtclsIndex > -1) {
      if (visitedPrtcl === -1) {
        visibleTooltip = false;
        clearTimeout(tooltipTimeout);
        visitedPrtcl = currentPrtclsIndex;
        tooltipTimeout = setTimeout(setTooltipTimeout, 700);
      }

      canvas.classList.add("move");
    } else {
      visibleTooltip = false;
      clearTimeout(tooltipTimeout);
      visitedPrtcl = -1;
      canvas.classList.remove("move");
    }
  }

  function handleResize(mouse: any) {
    let mousePosition = mouse.x - shift;
    let min = 0;
    let max = 99999999;
    handlePauseInChanging();
    let leftSub = prtcls[moveIndex - 1];
    let rightSub = prtcls[moveIndex + 1];
    if (leftSub) min = leftSub.x + leftSub.edge + shift;
    if (rightSub) max = rightSub.x + shift;

    if (currentPrtcl?.selected) {
      if (rightResize) {
        let distanceToBegin = mouse.x - currentPrtcl.x - shift;

        if (
          mouse.x <= max &&
          mouse.x > currentPrtcl.x + MINIMUM_BLOCK_TIME + shift
        ) {
          currentPrtcl.edge = distanceToBegin;
        } else if (mouse.x > max) {
          let innersubs = prtcls.filter(
            (p: any) => p.x > currentPrtcl.x && p.x + p.edge < mousePosition
          );
          if (innersubs?.length > 1) return;
          currentPrtcl.edge = distanceToBegin;
          newTime = currentPrtcl.x + currentPrtcl.edge;
          let inners = prtcls.filter((p: any) => p.x > currentPrtcl.x);
          inners.forEach((inner: any) => {
            if (inner.x < newTime) {
              if (inner.edge > MINIMUM_BLOCK_TIME * zoomLevel) {
                let endPoint = inner.x + inner.edge;
                inner.x = newTime;
                inner.edge = endPoint - inner.x;
              } else {
                inner.x = newTime;
              }
            } else {
              // if (inner.x < newTime) {
              //   inner.x = newTime;
              // }
            }

            newTime = inner.x + inner.edge;
          });
        }
      } else {
        let endPoint = currentPrtcl.x + currentPrtcl.edge;

        if (
          mouse.x > min &&
          mouse.x < currentPrtcl.x + currentPrtcl.edge - 0.3 + shift
        ) {
          currentPrtcl.x = mouse.x - shift;
          currentPrtcl.edge = endPoint - mouse.x + shift;
        } else if (mouse.x < min) {
          if (stopMove) return;
          let innersubs = prtcls.filter(
            (p: any) => p.x + p.edge > mousePosition && p.x < currentPrtcl.x
          );
          if (innersubs?.length > 1) return;
          let inners = prtcls.filter((p: any) => p.x < mouse.x - shift);
          newTime = mouse.x - shift;

          for (let i = inners?.length - 1; i >= 0; i--) {
            if (inners[i].x + inners[i].edge > newTime) {
              if (inners[i].edge > MINIMUM_BLOCK_TIME * zoomLevel) {
                currentPrtcl.x = mouse.x - shift;
                currentPrtcl.edge = endPoint - mouse.x + shift;
                inners[i].edge = newTime - inners[i].x;
              } else {
                if (newTime - inners[i].edge < 0) {
                  stopMove = true;
                } else {
                  currentPrtcl.x = mouse.x - shift;
                  currentPrtcl.edge = endPoint - mouse.x + shift;
                  inners[i].x = newTime - inners[i].edge;
                  newTime = inners[i].x;
                }
              }
            }
          }
        }
      }
    }
  }

  function toTime(s: any, withMilliSecond: any) {
    try {
      if (withMilliSecond)
        return new Date(s * 1000).toISOString().substr(11, 11);
      return new Date(s * 1000).toISOString().substr(11, 8);
    } catch (error) {
      return "";
    }
  }

  function setData(aligns: any) {
    prtcls = aligns.map(
      (p: any, i: any) =>
        new (Square as any)(
          p.begin * zoomLevel,
          LINE_HEIGHT,
          (p.end - p.begin) * zoomLevel,
          i,
          p.text,
          p.startIndex,
          p.endIndex,
          p.id
        )
    );
    return prtcls;
  }

  function showTooltip() {
    if (currentPrtcl) {
      ctx.save();
      ctx.translate(mouse.x + 10, mouse.y - 10);
      ctx.fillStyle = options.colors.tooltipBackground;
      ctx.font = "12px Arial";
      let width = ctx.measureText(currentPrtcl.text).width;
      let height = 20;
      ctx.fillRect(5 + width / -2, -22, width + 20, height);
      ctx.fillStyle = options.colors.tooltipText;
      ctx.fillText(currentPrtcl.text, 15 + width / -2, -12);
      ctx.restore();
    }
  }

  function cancelAnimate() {
    cancelAnimationFrame(animationID);
  }

  function handleCursorOutOfViewPort(time: any) {
    if (!player.paused) changeCursorViewPort(time);
  }

  function changeCursorViewPort(time: any) {
    if (scrolling) return;
    let transitionLevel = 1;
    let margin = (endTimeShow - beginingTimeShow) * 0.2;
    let remainingTime = endTimeShow - time;

    if (remainingTime < margin && autoScroll) {
      let delta = margin - remainingTime;

      if (shift - delta * zoomLevel * transitionLevel < maximumShift) {
        shift = maximumShift;
      } else {
        shift -= delta * zoomLevel * transitionLevel;
      }
    } else if (endTimeShow < time || beginingTimeShow > time) {
      let s;

      if (endTimeShow <= time) {
        s = -1 * time * zoomLevel + w * 0.8;
      } else {
        s = -1 * time * zoomLevel + 200;
      }

      if (s < 0) {
        shift = s;
      } else {
        shift = 0;
      }
    }

    checkShift();
    drawBG(bgCtx);
  }

  function drawBG(context: any, r = 1) {
    let rat = 5;
    if (zoomLevel > 50) rat = 10;
    if (zoomLevel > 100) rat = 15;
    if (zoomLevel > 150) rat = 20;
    if (zoomLevel > 200) rat = 25;

    globalRatio = globalRatio * r;
    context.save();
    context.clearRect(0, 0, canvas2.width, canvas2.height);
    context.fillStyle = "transparent";
    context.fillRect(0, 0, w, h);
    context.lineWidth = 0.3;
    context.strokeStyle = "lightgrey";
    context.fillStyle = "grey"; // vertical grid

    drawVerticalGrid(context);
    context.lineWidth = 0.5;
    context.strokeStyle = "grey"; //X-Axis

    drawXaxis(context);

    function drawVerticalGrid(ctx: any) {
      let initNumber = shift % zoomLevel;

      for (let i = initNumber; i < w; i += zoomLevel / rat) {
        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, h);
          ctx.moveTo(i, 0);

          ctx.closePath();
          ctx.stroke();
        }
      }
    }

    function drawXaxis(ctx: any) {
      ctx.beginPath();
      let counter = 0;
      let initNumber = shift % zoomLevel;
      for (let i = initNumber; i < w; i += zoomLevel / rat) {
        if (counter % rat === 0) {
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 30);
          context.fillStyle = "grey";
          if (zoomLevel > 50) {
            ctx.fillText(
              ` ${toTime((i - shift) / zoomLevel, null)}`,
              i,
              30,
              zoomLevel - 2
            );
          } else {
            // let viewPortTime = endTimeShow - beginingTimeShow;
            ctx.fillText(
              ` ${new Date(((i - shift) / zoomLevel) * 1000)
                .toISOString()
                .substr(endTime > 7000 ? 11 : 14, 5)}`,
              i,
              30,
              zoomLevel - 2
            );
          }
        } else {
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 10);
        }
        counter++;
      }

      ctx.closePath();
      ctx.stroke();
    }
  }

  function handleClick() {
    scrolling =
      cursorInScrollBar() &&
      isMouseDown &&
      !resizing &&
      !moving &&
      !resizing &&
      !swaping;
  }

  function cursorInScrollBar() {
    if (
      mouse.x > scrollPosition &&
      mouse.x < scrollPosition + scrollSize &&
      mouse.y > TIMELINE_HEIGHT - SCROLL_BAR_HEIGHT &&
      mouse.y < TIMELINE_HEIGHT
    ) {
      return true;
    } else {
      if (scrolling && !resizing && !swaping) return true;
    }

    return false;
  }

  function changeAutoScroll(a: any) {
    autoScroll = a.detail.status;
  }

  function drawScroll() {
    let cursorInScroll = cursorInScrollBar();
    scrolling = cursorInScroll && isMouseDown && !resizing;

    if (cursorInScroll || scrolling) {
      canvas.classList.add("e-resize");
    } else {
      canvas.classList.remove("e-resize");
    }
    let padding = 1;
    let context = ctx;
    context.save();
    context.fillStyle = options.colors.scrollBarBackground;

    // Linea que contiene a la barra de scroll
    context.fillRect(
      0,
      TIMELINE_HEIGHT - SCROLL_BAR_HEIGHT + padding,
      w,
      SCROLL_BAR_HEIGHT - padding
    );
    context.fillStyle =
      cursorInScroll || scrolling
        ? options.colors.scrollBarHover
        : options.colors.scrollBar;
    let d = endTimeShow - beginingTimeShow;
    let rat = d / endTime;
    scrollSize = w * rat;
    if (rat > 1) rat = 1;
    let ratio = beginingTimeShow / endTime;
    scrollPosition = ratio * w;
    // Barra de scroll
    context.fillRect(
      scrollPosition,
      TIMELINE_HEIGHT - SCROLL_BAR_HEIGHT + padding * 2,
      scrollSize,
      SCROLL_BAR_HEIGHT - 2 * (1 + padding)
    );
    context.restore();
  }

  function addListenerHandlers(canvas: any) {
    window.removeEventListener("resize", resize);
    window.addEventListener("resize", resize);
    canvas.removeEventListener("wheel", handleZoom);
    canvas.addEventListener("wheel", handleZoom);
    canvas.removeEventListener("mousemove", mousemoveGeneral);
    canvas.addEventListener("mousemove", mousemoveGeneral);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", mouseup);
    window.addEventListener("mouseup", mouseup);
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("dblclick", handleDbClick);
    canvas.addEventListener("dblclick", handleDbClick);
    window.removeEventListener("changeAutoScroll", changeAutoScroll);
    window.addEventListener("changeAutoScroll", changeAutoScroll);
    canvas.removeEventListener("click", handleClick);
    canvas.addEventListener("click", handleClick);

    canvas.removeEventListener("touchstart", handleClick);
    canvas.addEventListener("touchstart", handleClick);
    canvas.removeEventListener("touchmove", mousemoveGeneral);
    canvas.addEventListener("touchmove", mousemoveGeneral);
    canvas.removeEventListener("touchmove", handleMouseMove);
    canvas.addEventListener("touchmove", handleMouseMove);
    canvas.removeEventListener("touchstart", handleMouseDown);
    canvas.addEventListener("touchstart", handleMouseDown);
  }

  function removeListeners() {
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("wheel", handleZoom);
    canvas.removeEventListener("mousemove", mousemoveGeneral);
    canvas.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", mouseup);
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("dblclick", handleDbClick);
    window.removeEventListener("changeAutoScroll", changeAutoScroll);
    canvas.removeEventListener("click", handleClick);

    canvas.removeEventListener("touchstart", handleClick);
    canvas.removeEventListener("touchmove", mousemoveGeneral);
    canvas.addEventListener("touchmove", handleMouseMove);
    canvas.removeEventListener("touchstart", handleMouseDown);
  }

  function checkShift() {
    let newShift = w - endTime * zoomLevel;

    if (newShift > 0) {
      maximumShift = 0;
    } else {
      maximumShift = newShift;
    }

    if (shift < maximumShift) {
      shift = maximumShift;
    }
  }

  function animate() {
    var _player;

    if (!player) player = getPlayer();
    currentTime =
      ((_player = player) === null || _player === void 0
        ? void 0
        : _player.currentTime) || 0;
    calculateViewPortTimes();
    if (player) handleCursorOutOfViewPort(currentTime); //clear paper

    ctx.clearRect(0, 0, w, ctx.canvas.height); //draw boxes

    if (!moving) currentPrtclsIndex = -1;
    currentHoveredIndex = -1;
    prtcls.filter((e: any, i: number) => {
      let isHoveredPrtcl = cursorInRect(mouse.x, mouse.y, e.x, e.y, e.edge);
      let position = currentTime * zoomLevel + shift; //player on box

      if (position - shift >= e.x && position - shift <= e.x + e.edge) {
        currentHoveredIndex = i;
      } //mouse on box

      if (isHoveredPrtcl && !resizing && !moving) currentPrtclsIndex = i;
      e.active = !!isHoveredPrtcl; //check prtcls is in viewport

      let condition =
        (e.x >= -1 * shift && e.x + e.edge < -1 * shift + w) ||
        (e.x + e.edge > -1 * shift && e.x < -1 * shift + w);

      if (condition) {
        e.draw(ctx);
      }

      return condition;
    });

    if (!resizing && !moving) {
      moveIndex = currentPrtclsIndex;
      // [TODO]: Remover este if
      currentPrtcl = prtcls[currentPrtclsIndex];
      setCurrentPrtcl(prtcls[currentPrtclsIndex]);
    }

    if (beginingTimeShow > endTime) shift = endTime - beginingTimeShow; //red cursor time

    drawTimeCursor();
    drawScroll();
    checkShift();

    if (visibleTooltip && !resizing && !moving && !leftResize && !rightResize) {
      showTooltip();
    }

    handleCursor();
    animationID = window.requestAnimationFrame(animate);
  }

  return {
    setData,
    cancelAnimate,
    changeZoom,
    changeCursorViewPort,
    removeListeners,
  };
}
