export class Knob extends HTMLElement {
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();

        this.rotation = 0;
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();

        const volBtn = this.shadowRoot.getElementById("vol-btn")
        const knobValue = this.shadowRoot.getElementById("value")

        let isDragging = false
        let lastY = 0
        let rotation = 50


        volBtn.onpointerdown = e => {
            isDragging = true
            lastY = e.clientY
            volBtn.setPointerCapture(e.pointerId)

        }

        volBtn.onpointermove = (e) => {
            if (!isDragging) return
            const deltaY = lastY - e.clientY
            rotation += deltaY * .9;
            rotation = Math.max(0, Math.min(180, rotation))
            knobValue.innerText = Math.round(rotation * 100 / 180)
            this.rotation = rotation;
            volBtn.style.transform = `rotate(${rotation}deg)`
            lastY = e.clientY
        }

        volBtn.onpointerup = () => {
            isDragging = false
        }


    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }


    render() {
        const title = this.getAttribute('title') || '';
        const description = this.getAttribute('description') || '';
        const imageUrl = this.getAttribute('image-url') || '';
        const picCredits = this.getAttribute('pic-credits') || '';

        // Inject HTML and CSS into the shadow DOM
        this.shadowRoot.innerHTML = `      

        <style>
.vol-up{
  height:40px;
  width: 40px;
  background: black;
  border-radius: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 0px solid red;
}
.knob-group{
  display: flex;
  justify-content: center;
  flex-direction: column;
}.value{
  font-size: 20px;
  font-weight: 300;
  color: rgb(119, 119, 119);
  width: 100%;
  text-align: center;
}

        </style>
        <div class="knob-group">
       <button class="vol-up" id="vol-btn">
                        <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="8" width="59" height="59" rx="29.5" fill="#151515"
                                stroke="url(#paint0_linear_59_11)" stroke-width="16" />
                            <path d="M37.5 13V31" stroke="white" stroke-width="5" stroke-linecap="round" />
                            <defs>
                                <linearGradient id="paint0_linear_59_11" x1="38" y1="-4.90497e-09" x2="37.5" y2="75"
                                    gradientUnits="userSpaceOnUse">
                                    <stop offset="0.353714" stop-color="#404040" />
                                    <stop offset="0.448146" stop-color="#292929" />
                                </linearGradient>
                            </defs>
                        </svg>

                    </button>
                    <span class="value" id="value">0</span>
                    </div>
                    <script>
                        
                    </script>
    `;
    }
}