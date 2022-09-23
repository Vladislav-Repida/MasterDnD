class DragAndDrop{
    constructor({targetElementSelector, dropZoneSelector = `.${this.getNameSelector(targetElementSelector)}-drop-zone`, moveClass = `${this.getNameSelector(targetElementSelector)}-move`, selectClass = `${this.getNameSelector(targetElementSelector)}-select`, illuminationClass = `${this.getNameSelector(targetElementSelector)}-illumination`}){
        this.targetElementSelector = targetElementSelector; // Селектор элементов'a которые мы будем перемещать
        this.elementMove; // Объявляем поле для элемента который будет копироваться для создания клона
        this.cloneElementMove;
        this.moveClass = moveClass; // Класс который будет элементу добавляться при перемещении

        this.dropZoneSelector = dropZoneSelector;
        this.elementsDropZone = document.querySelectorAll(dropZoneSelector);

        this.dropZoneHoverElement;

        this.isTouch = this.is_touch_enabled();

        this.elementSelect;
        this.selectClass = selectClass;
        this.illuminationClassDropZone = illuminationClass;

        this.enableEventsDnD(); // Запускаем все события связанные с drag and drop
    }

    checkAreaDropZone = (e) => {
        let x = e.pageX;
        let y = e.pageY;

        for (let index = 0; index < this.elementsDropZone.length; index++) {
            const infoWraper = this.elementsDropZone[index].getBoundingClientRect();
            const coords = this.getCoords(this.elementsDropZone[index]);

            if(x >= coords.left && x <= coords.left + infoWraper.width && y >= coords.top && y <= coords.top + infoWraper.height){
                for (let index2 = 0; index2 < this.elementsDropZone.length; index2++) {
                    this.elementsDropZone[index2].classList.remove("hover");
                }
                this.elementsDropZone[index].classList.add("hover");
                this.dropZoneHoverElement = this.elementsDropZone[index];
                break;
            }
            else{
                this.elementsDropZone[index].classList.remove("hover");
                this.dropZoneHoverElement = null;
            }
        }
    }

    pasteElementToDropZone(){
        const element = this.elementMove.cloneNode();
        this.dropZoneHoverElement.append(element);
        this.dropZoneHoverElement.classList.remove("hover");

        this.createCustomEvent(element);
    }

    createCustomEvent(element){
        let event = new Event("drop-element-dnd", {bubbles: true}); // (2)
        element.dispatchEvent(event);
    }

    enableIlluminationDropZones(){
        this.elementsDropZone.forEach(element => {
            element.classList.add(this.illuminationClassDropZone);
        });
    }
    disableIlluminationDropZones(){
        this.elementsDropZone.forEach(element => {
            element.classList.remove(this.illuminationClassDropZone);
        });
    }

    movementProcessing = (e) => {
        let X;
        let Y;
        if(e.type === "mousemove"){
            X = e.clientX;
            Y = e.clientY;

            const screenHeight = window.innerHeight;

            if(X < 0 + this.cloneElementMove.offsetWidth / 2 && Y < 0 + this.cloneElementMove.offsetWidth / 2){
                this.cloneElementMove.style.left = 0 - this.cloneElementMove.offsetWidth / 2 + 'px';
                this.cloneElementMove.style.top = 0 - this.cloneElementMove.offsetHeight / 2 + 'px';
                return;
            }

            if(X < 0 + this.cloneElementMove.offsetWidth / 2 && Y > screenHeight - this.cloneElementMove.offsetWidth / 2){
                this.cloneElementMove.style.left = 0 - this.cloneElementMove.offsetWidth / 2 + 'px';
                this.cloneElementMove.style.top = screenHeight - this.cloneElementMove.offsetHeight / 2 + 'px';
                return;
            }

            if(Y < 0 + this.cloneElementMove.offsetWidth / 2 && X > window.innerWidth - this.cloneElementMove.offsetWidth / 2){
                this.cloneElementMove.style.left = window.innerWidth - this.cloneElementMove.offsetWidth / 2 + 'px';
                this.cloneElementMove.style.top = 0 - this.cloneElementMove.offsetHeight / 2 + 'px';
                return;
            }

            if(X > window.innerWidth - this.cloneElementMove.offsetWidth / 2 && Y > screenHeight - this.cloneElementMove.offsetWidth / 2){
                this.cloneElementMove.style.left = window.innerWidth - this.cloneElementMove.offsetWidth / 2 + 'px';
                this.cloneElementMove.style.top = screenHeight - this.cloneElementMove.offsetHeight / 2 + 'px';
                return;
            }


            if(X < 0 + this.cloneElementMove.offsetWidth / 2){
                this.cloneElementMove.style.left = 0 - this.cloneElementMove.offsetWidth / 2 + 'px';
                this.cloneElementMove.style.top = Y - this.cloneElementMove.offsetHeight / 2 + 'px';
                return;
            }
            if(Y < 0 + this.cloneElementMove.offsetWidth / 2){
                this.cloneElementMove.style.left = X - this.cloneElementMove.offsetWidth / 2 + 'px';
                this.cloneElementMove.style.top = 0 - this.cloneElementMove.offsetHeight / 2 + 'px';
                return;
            }
            if(X > window.innerWidth - this.cloneElementMove.offsetWidth / 2){
                this.cloneElementMove.style.left = window.innerWidth - this.cloneElementMove.offsetWidth / 2 + 'px';
                this.cloneElementMove.style.top = Y - this.cloneElementMove.offsetHeight / 2 + 'px';
                return;
            }
            if(Y > screenHeight - this.cloneElementMove.offsetWidth / 2){
                this.cloneElementMove.style.left = X- this.cloneElementMove.offsetWidth / 2 + 'px';
                this.cloneElementMove.style.top = screenHeight - this.cloneElementMove.offsetHeight / 2 + 'px';
                return;
            }
        }

        this.cloneElementMove.style.left = X - this.cloneElementMove.offsetWidth / 2 + 'px';
        this.cloneElementMove.style.top = Y - this.cloneElementMove.offsetHeight / 2 + 'px';
    }

    // Функция запуска событий мыши для Drag and Drop
    enableEventMouse() {
        // Событие нажатия клавиши мыши
        document.onmousedown = (e) => {
            // Проверка нажатия на правую кнопку мыши и на элемент с выбранным селектором в конструкторе
            if(e.button === 0 && e.target.closest(this.targetElementSelector)){
                this.elementMove = e.target; // Запоминаем перемещаемый элемент
                if(!this.cloneElementMove){
                    this.createCloneElement();
                }
                this.enableIlluminationDropZones();
                // Запускаем функцию movementProcessing по событию перемещения курсора мыши
                document.onmousemove = (e) => {
                    this.movementProcessing(e);
                    this.checkAreaDropZone(e);
                };
            }
        }


        // Событие прекращения нажатия на клавишу мыши
        document.onmouseup = () => {
            document.onmousemove = null; // Удаляем событие onMouseMove
            console.log(this.elementMove)
            console.log(this.dropZoneHoverElement)
            if(this.elementMove && this.dropZoneHoverElement){
                this.pasteElementToDropZone(); 
            }
            this.RemoveMoveElement();
            this.disableIlluminationDropZones();
        }
    }

    enableEventTouch(){
        document.addEventListener("click", (e) =>{
            if(e.target.closest(this.targetElementSelector) && !e.target.closest(this.dropZoneSelector)){

                if(this.elementSelect){
                    this.elementSelect.classList.remove(this.selectClass);
                    this.elementSelect = null;
                    this.disableIlluminationDropZones();
                }

                this.elementSelect = e.target.closest(this.targetElementSelector);
                this.elementSelect.classList.add(this.selectClass);
                this.enableIlluminationDropZones();
            }
            else if(e.target.closest(this.dropZoneSelector)){
                if(this.elementSelect){
                    this.elementSelect.classList.remove(this.selectClass);
                    const clone = this.elementSelect.cloneNode();
                    e.target.closest(this.dropZoneSelector).append(clone);
                    this.elementSelect = null;

                    this.disableIlluminationDropZones();
                    this.createCustomEvent(clone);
                }
            }
            else{
                if(this.elementSelect){
                    this.elementSelect.classList.remove(this.selectClass);
                    this.elementSelect = null;
                }
                this.disableIlluminationDropZones();
            }
        })
    }

    // Удаляем перемещаемый элемент
    RemoveMoveElement = () =>{
        this.elementMove = null; // Обнуляем поле элемента перемещения
        if(this.cloneElementMove){
            this.cloneElementMove.remove();
            this.cloneElementMove = null;
        }
    }

    // Создание клона перемещаемого элемента и вставка его на страницу
    createCloneElement(){
        const coords = this.getCoords(this.elementMove);

        this.cloneElementMove = this.elementMove.cloneNode(true);
        this.cloneElementMove.setAttribute("data-id", this.guid());
        this.cloneElementMove.classList.add(this.moveClass);
        this.cloneElementMove.style.position = "fixed";
        this.cloneElementMove.style.left = `${coords.left}px`;
        this.cloneElementMove.style.top = `${coords.top}px`;
        document.body.appendChild(this.cloneElementMove);
    }

    // Функция отключения стандартного Drag and Drop HTML
    enableEventNoDnDHTML(){
        document.querySelectorAll(this.targetElementSelector).forEach(item => {
            item.setAttribute("draggable", false);
        })

        document.ondragstart = (e) => {
            console.log(e);
            const selector = this.targetElementSelector[0] === "." || this.targetElementSelector[0] === "#" ? this.targetElementSelector.substring(1, this.targetElementSelector.length) : this.targetElementSelector;
            if(e.target.classList && e.target.classList.contains(selector)){
                console.log("dragstart false");
                return false;
            }
        };
    }

    // Функция запуска всех событий для Drag and Drop
    enableEventsDnD(){
        this.enableEventNoDnDHTML(); // Запускаем событие отключения стандартного Drag and Drop HTML

        if(this.isTouch){
            this.enableEventTouch();
        }
        else{
            this.enableEventMouse(); // Запускаем события мыши для Drag and Drop
        }
    }

    guid() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    getCoords(elem) {
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docEl = document.documentElement;
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;
        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    }

    getNameSelector(selector){
        return selector[0] === "." || selector[0] === "#" ? selector.substring(1, selector.length) : selector;
    }

    is_touch_enabled() {
        return ( 'ontouchstart' in window ) ||
               ( navigator.maxTouchPoints > 0 ) ||
               ( navigator.msMaxTouchPoints > 0 );
    }
}