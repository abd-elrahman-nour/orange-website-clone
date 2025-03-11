function initiliazeSlider(slider) {
  // Initialize the slider
  slider.activeIndex = 0;
  slider.slides = slider.querySelectorAll(".flex-slider-item");
  slider.slidesContainer = slider.querySelector(".flex-slides-container");
  slider.slideWidth = slider.slides[0].getBoundingClientRect().width;

  slider.computeThreshold = computeThreshold;
  slider.applyTransform = applyTransform;
  slider.slideTo = slideTo;
  slider.attachSliderControls = attachSliderControls;
  slider.handleResize = handleResize;

  slider.threshold = slider.computeThreshold();
}

function computeThreshold() {
  const threshold = this.slideWidth * this.slides.length - this.slideWidth;
  return threshold;
}

function applyTransform(
  transformValue,
  callback = undefined,
  args = undefined
) {
  this.slidesContainer.style.transform = `translateX(${transformValue}px)`;
  if (callback) callback(args);
}

function slideTo(slideIndex, callback = undefined, args = undefined) {
  const transformValue = -(slideIndex * this.slideWidth);
  this.applyTransform(transformValue);
  if (callback) callback(args);
}

function attachSliderControls(options = undefined) {
  const [prevBtn, nextBtn] = this.querySelectorAll(".slider-controls > button");
  if (options) {
    const { prevBtnOptions, nextBtnOptions } = options;
    prevBtnOptions.events.forEach((event) =>
      prevBtn.addEventListener(event.type, event.handler)
    );
    nextBtnOptions.events.forEach((event) =>
      nextBtn.addEventListener(event.type, event.handler)
    );
    return;
  }

  prevBtn.addEventListener("click", (e) => {
    if (this.activeIndex <= 0) return;
    this.activeIndex--;
    this.slideTo(this.activeIndex);
  });

  nextBtn.addEventListener("click", (e) => {
    if (this.activeIndex >= this.slides.length) return;
    this.activeIndex++;
    this.slideTo(this.activeIndex);
  });
}

function handleResize() {
  this.slideWidth = this.slides[0].getBoundingClientRect().width;
  this.threshold = this.computeThreshold();
  this.slideTo(this.activeIndex);
}

const flexSliderUtils = {
  initiliazeSlider,
};

// Note: the slider utils shouldn't be here but I placed it here because of CORS issues

const flexSlider = document.querySelector(".flex-slider");
const flexSlidesContainer = document.querySelector(".flex-slides-container");
const flexSliderItems =
  flexSlidesContainer.querySelectorAll(".flex-slider-item");

let flexSliderItemWidth = flexSliderItems[0].getBoundingClientRect().width;
const [prevBtn, nextBtn] = document.querySelectorAll(
  ".slider-controls > button"
);

let currentTransform = 0;
let activeIndicatorIndex = 0;
let th = flexSliderItemWidth * flexSliderItems.length - flexSliderItemWidth;

prevBtn.addEventListener("click", (e) => {
  if (currentTransform >= 0) return;
  enableSliderBtn(nextBtn);
  sliderIndicatorsContainer.children[activeIndicatorIndex].classList.remove(
    "active-indicator"
  );

  activeIndicatorIndex--;
  sliderIndicatorsContainer.children[activeIndicatorIndex].classList.add(
    "active-indicator"
  );
  currentTransform += flexSliderItemWidth;
  flexSlidesContainer.style.transform = `translateX(${currentTransform}px)`;
  if (currentTransform >= 0) disableSliderBtn(prevBtn);
});

nextBtn.addEventListener("click", (e) => {
  if (currentTransform <= -th) return;
  enableSliderBtn(prevBtn);
  sliderIndicatorsContainer.children[activeIndicatorIndex].classList.remove(
    "active-indicator"
  );

  activeIndicatorIndex++;
  sliderIndicatorsContainer.children[activeIndicatorIndex].classList.add(
    "active-indicator"
  );
  currentTransform -= flexSliderItemWidth;
  flexSlidesContainer.style.transform = `translateX(${currentTransform}px)`;

  if (currentTransform <= -th) disableSliderBtn(nextBtn);
});

const sliderIndicatorsContainer = document.querySelector(
  ".indicators-container"
);

function addSliderIndicators(sliderIndicatorsContainer) {
  for (let i = 0; i < flexSliderItems.length; i++) {
    const indicator = document.createElement("button");

    indicator.classList.add("slider-indicator");
    i === 0 ? indicator.classList.add("active-indicator") : null;

    indicator.setAttribute("tabindex", "-1");
    indicator.setAttribute("aria-hidden", "true");
    indicator.setAttribute("title", `slide ${i + 1}`);

    indicator.addEventListener("click", (e) => {
      if (activeIndicatorIndex === i) return;
      sliderIndicatorsContainer.children[activeIndicatorIndex].classList.remove(
        "active-indicator"
      );

      activeIndicatorIndex = i;
      sliderIndicatorsContainer.children[activeIndicatorIndex].classList.add(
        "active-indicator"
      );

      currentTransform = -(activeIndicatorIndex * flexSliderItemWidth);
      flexSlidesContainer.style.transform = `translateX(${currentTransform}px)`;
    });

    sliderIndicatorsContainer.appendChild(indicator);
  }
}

addSliderIndicators(sliderIndicatorsContainer);

function autoSliding() {
  if (currentTransform <= -th) {
    enableSliderBtn(nextBtn);
    disableSliderBtn(prevBtn);
    sliderIndicatorsContainer.children[activeIndicatorIndex].classList.remove(
      "active-indicator"
    );

    currentTransform = 0;
    activeIndicatorIndex = 0;

    flexSlidesContainer.style.transform = `translateX(${currentTransform}px)`;
    sliderIndicatorsContainer.children[activeIndicatorIndex].classList.add(
      "active-indicator"
    );
    return;
  }
  enableSliderBtn(prevBtn);

  sliderIndicatorsContainer.children[activeIndicatorIndex].classList.remove(
    "active-indicator"
  );

  activeIndicatorIndex++;
  sliderIndicatorsContainer.children[activeIndicatorIndex].classList.add(
    "active-indicator"
  );
  currentTransform -= flexSliderItemWidth;
  flexSlidesContainer.style.transform = `translateX(${currentTransform}px)`;
  if (currentTransform <= -th) disableSliderBtn(nextBtn);
}

setInterval(autoSliding, 3000);

function adjustTransformation() {
  let slideIndex;
  for (let i = 0; i < flexSliderItems.length; i++) {
    const transformation = flexSliderItemWidth * i;

    if (-transformation === currentTransform) {
      slideIndex = i;
      break;
    }
  }

  flexSliderItemWidth = flexSliderItems[0].getBoundingClientRect().width;

  currentTransform = -(slideIndex * flexSliderItemWidth);
  th = flexSliderItemWidth * flexSliderItems.length - flexSliderItemWidth;
  flexSlidesContainer.style.transform = `translateX(${currentTransform}px)`;
}

window.addEventListener("resize", adjustTransformation);

const chatCard = document.querySelector(".chat-widget-card");
const openChatBtn = document.querySelector(".open-chat-btn");
const closeChatBtn = document.querySelector(".close-chat-btn");
const minimizeChatBtn = document.querySelector(".minimize-chat-btn");
const confirmClosingChat = document.querySelector(".confirm-closing-chat");
const confirmClosingChatBtns = confirmClosingChat.querySelectorAll("button");

minimizeChatBtn.addEventListener(
  "click",
  () => chatCard.classList.remove("chat-widget-card-visible"),
  chatCard.classList.add("hidden")
);

confirmClosingChatBtns.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.value === "yes") {
      context.chatWindowForm.setAttribute("aria-hidden", "false"),
        context.chatWindowForm.classList.remove("hidden");
      confirmClosingChat.classList.add("hidden"),
        chatCard.classList.remove("chat-widget-card-visible"),
        chatCard.classList.add("hidden");
    } else if (button.value === "no")
      confirmClosingChat.classList.add("hidden"),
        context.chatWindowForm.setAttribute("aria-hidden", "false"),
        context.chatWindowForm.classList.remove("hidden");
  });
});

function disableSliderBtn(button) {
  button.disabled = true;
  button.style.opacity = "0.5";
}

function enableSliderBtn(button) {
  button.disabled = false;
  button.style.opacity = "1";
}

const initOptions = [
  {
    element: ".open-chat-btn",
    multi: false,
    events: [
      {
        type: "click",
        handler: () => {
          chatCard.classList.add("chat-widget-card-visible"),
            chatCard.classList.remove("hidden");
        },
      },
    ],
  },
  {
    element: window,
    events: [
      {
        type: "resize",
        handler: adjustTransformation,
      },
    ],
  },
  {
    element: ".close-chat-btn",
    multi: false,
    events: [
      {
        type: "click",
        handler: (context) => context.closeChat(context),
      },
    ],
  },
  {
    element: "#cencel-chat-btn",
    multi: false,
    events: [
      {
        type: "click",
        handler: (context) => context.closeChat(context),
      },
    ],
  },
  {
    element: ".minimize-chat-btn",
    multi: false,
    events: [
      {
        type: "click",
        handler: () => {
          chatCard.classList.remove("chat-widget-card-visible"),
            chatCard.classList.add("hidden");
        },
      },
    ],
  },
];

const context = {
  confirmDialog: document.querySelector(".confirm-closing-chat"),
  chatWindowForm: document.querySelector(".chat-widget-card form"),
  closeChat: (context) => {
    if (!context.confirmDialog.classList.contains("hidden")) return;

    // Show the dialog and let screen readers process it
    context.confirmDialog.classList.remove("hidden");
    context.chatWindowForm.classList.add("hidden");
    context.chatWindowForm.setAttribute("aria-hidden", "true");
  },
};

function initElements(initOptions, context) {
  for (const option of initOptions) {
    const elements =
      typeof option.element === "string"
        ? option.multi
          ? document.querySelectorAll(option.element)
          : [document.querySelector(option.element)]
        : [option.element];

    elements.forEach((el) => {
      if (!el) return; // Skip if the element is null or undefined
      option.events?.forEach((event) => {
        el.addEventListener(event.type, () => event.handler(context));
      });
    });
  }
}

initElements(initOptions, context);

const secondarySlider = document.querySelector(".secondary-slider");
const [secondarySliderPrevBtn, secondarySliderNextBtn] =
  secondarySlider.querySelectorAll(".slider-controls > button");
flexSliderUtils.initiliazeSlider(secondarySlider);
secondarySlider.attachSliderControls({
  prevBtnOptions: {
    events: [
      {
        type: "click",
        handler: (e) => {
          if (secondarySlider.activeIndex <= 0) return;
          enableSliderBtn(secondarySliderNextBtn);
          secondarySlider.activeIndex -= 4;
          secondarySlider.slideTo(secondarySlider.activeIndex, () =>
            secondarySlider.activeIndex <= 0
              ? disableSliderBtn(secondarySliderPrevBtn)
              : enableSliderBtn(secondarySliderPrevBtn)
          );
        },
      },
    ],
  },
  nextBtnOptions: {
    events: [
      {
        type: "click",
        handler: (e) => {
          if (secondarySlider.activeIndex >= 4) return;
          enableSliderBtn(secondarySliderPrevBtn);
          secondarySlider.activeIndex += 4;
          secondarySlider.slideTo(secondarySlider.activeIndex, () =>
            secondarySlider.activeIndex >= 4
              ? disableSliderBtn(secondarySliderNextBtn)
              : enableSliderBtn(secondarySliderNextBtn)
          );
        },
      },
    ],
  },
});

disableSliderBtn(secondarySliderPrevBtn);
