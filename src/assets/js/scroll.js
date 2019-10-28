window.addEventListener('scroll', function() {
    document.querySelectorAll(".animate-item").forEach(function(item){
        if(item.getBoundingClientRect().top + pageYOffset + 150 < pageYOffset + document.documentElement.clientHeight){
            item.classList.add('active')
        }
    })
})