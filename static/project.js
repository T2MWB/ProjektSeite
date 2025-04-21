const projektname = "blastx";
//get data from JSON files
fetch(`/api/data/${projektname}`)
.then(response => response.json())
.then(data =>{
    console.log(data)
    const status = document.getElementById('status');
    const buttons = [];
    //Add a Button for each Part
    data.parts.forEach(element => {
        const Button = document.createElement('button');
        const content = document.createElement('div');
        Button.classList.add('statusContainer')
        content.classList.add('content')
        content.style.display = "none";
        Button.textContent = element.name;
        content.textContent = "DAS IST EIN TEST MWAHAHAHAHA";
        status.appendChild(Button);
        status.appendChild(content);
        buttons.push({ button: Button, content: content });
        Button.addEventListener("click", function () {
            buttons.forEach(pair => {
                    // Wenn nicht der aktuelle Button, schließen
                    if (pair.button !== this) {
                        pair.content.style.display = "none";
                        pair.button.classList.remove("active");
                    }
                });
                // Toggle für geklickten Button
                const isOpen = content.style.display === "block";
                content.style.display = isOpen ? "none" : "block";
                this.classList.toggle("active", !isOpen);
        });
    });
    
})