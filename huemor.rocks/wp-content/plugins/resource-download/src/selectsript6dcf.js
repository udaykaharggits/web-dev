(function () {
    window.addEventListener('load', () => {
        if (document.querySelector('.ResourceDownload-form')) {
            if(document.querySelector('.ResourceDownload-form .hs-fieldtype-select select')){
                let label = document.querySelector('.ResourceDownload-form .hs-fieldtype-select label');
            
                let labelValue = label.childNodes[0].innerHTML;

                if(label.childNodes[1] && label.childNodes[1].innerHTML){
                    labelValue += label.childNodes[1].innerHTML
                }

                let select = document.querySelector('.ResourceDownload-form .hs-fieldtype-select select');
                
                select.childNodes[0].innerHTML = labelValue;

                label.style.display = 'none';
            }
            
            let inputs = document.querySelectorAll('.ResourceDownload-form .hs-input');
            
            for (let i = 0; i < inputs.length; i++) {
                let thisInput = inputs[i];
    
                if (thisInput.value) {
                    thisInput.parentNode.parentNode.classList.add('active');
                }
    
                thisInput.addEventListener('focus', () => {
                    thisInput.parentNode.parentNode.classList.add('active');
                });
    
                thisInput.addEventListener('focusout', () => {
                    if (!thisInput.value) {
                        thisInput.parentNode.parentNode.classList.remove('active');
                    }
                });
            }
        }
        if (document.querySelectorAll('.ResourceDownload-container')){
            let forms = document.querySelectorAll('.ResourceDownload-container');
            for (let i = 0; i < forms.length; i++) {
                let thisForm = forms[i];
    
                thisForm.style.display = "block"
            }
        }
    });
})();


