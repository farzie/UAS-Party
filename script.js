
(function() {
    emailjs.init("ItCz1HpjUwLEpKGxc"); // Email API rek, plis jangan dimainin
})();

$(document).ready(function() {

    console.log(localStorage.getItem('users'));
    console.log(sessionStorage.getItem('loggedInUser'));
    console.log(localStorage.getItem('registeredEmails'));
    console.log(localStorage.getItem('messageEmails'));


    // Burger momentos
    $('#menu-toggle').on('click', function() {
        $('#mobile-menu').slideToggle(500);
        $('#mobile-menu').toggleClass('hidden');
        // Toggle the SVG path
        const menuIcon = $('#menu-icon');
        if (menuIcon.attr('d') === 'm 4 6 h 16 m -16 6 h 16 m -16 6 h 16') {
            menuIcon.attr('d', 'M 4 6 l 16 12 M 4 11 l 0 0 m 0 7 l 16 -12');
        } else {
            menuIcon.attr('d', 'm 4 6 h 16 m -16 6 h 16 m -16 6 h 16');
        }
    });

    $(window).resize(function() {
        if (($(window).width() > 1023) && !($('#mobile-menu').hasClass('hidden'))) {
            $('#mobile-menu').slideToggle(500); // Toggle the mobile menu
            $('#mobile-menu').toggleClass('hidden');
            const menuIcon = $('#menu-icon');
            if (menuIcon.attr('d') === 'm 4 6 h 16 m -16 6 h 16 m -16 6 h 16') {
                menuIcon.attr('d', 'M 4 6 l 16 12 M 4 11 l 0 0 m 0 7 l 16 -12');
            } else {
                menuIcon.attr('d', 'm 4 6 h 16 m -16 6 h 16 m -16 6 h 16');
            }
        }
    });

    // Scrolling down
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#scrollToTop').removeClass('opacity-0 pointer-events-none').addClass('opacity-100');
        } else {
            $('#scrollToTop').addClass('opacity-0 pointer-events-none').removeClass('opacity-100');
        }
    });

    $('#scrollToTop').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // Newsletter form
    $('#newsForm').on('submit', function(event) {
        event.preventDefault();

        var email = $('#emailNews').val();
        var name = $('#nameNews').val();

        var registeredEmails = JSON.parse(localStorage.getItem('registeredEmails')) || [];

        if (registeredEmails.includes(email)) {
            alert('Email ini sudah terdaftar. Silakan gunakan email lain.');
        } else {
            var templateParams = {
                to_name: name,
                to_email: email,
                message: '',
            };

            emailjs.send('default_service', 'darjono_newsletter', templateParams)
                .then(function(response) {
                    registeredEmails.push(email);
                    localStorage.setItem('registeredEmails', JSON.stringify(registeredEmails));
                    alert('Terimakasih ' + templateParams.to_name + '. Emailmu akan mendapatkan update terkini dari kami, silahkan buka email Anda.');
                }, function(error) {
                    alert('Gagal menambahkan akunmu pada Newsletter.');
                });

            $('#newsForm')[0].reset();
        }
    });

    // Contact form, maksimal 2 template yasudin reusing aja
    $('#contactMessage').on('submit', function(event) {
        event.preventDefault();

        var name = $('#nameContact').val();
        var email = $('#emailContact').val();
        var message = $('#messageContact').val();

        var messageEmails = JSON.parse(localStorage.getItem('messageEmails')) || [];

        if (messageEmails.includes(email)) {
            alert('Email ini sudah pernah menghubungi kami.');
        } else {
            var templateParams = {
                to_name: name + ' ' + email,
                to_email: 'darmisarjono92@gmail.com',
                message: message,
            };

            emailjs.send('default_service', 'darjono_newsletter', templateParams)
                .then(function(response) {
                    messageEmails.push(email);
                    localStorage.setItem('messageEmails', JSON.stringify(messageEmails));
                    alert('Terimakasih ' + name + '. Pesanmu akan tersampaikan ke pimpinan partai secepatnya.');
                }, function(error) {
                    alert('Gagal mengirim pesan.');
                });

            $('#contactMessage')[0].reset();
        }
    });

    // Home hero
    const bgImages = [
        'url(resources/images/hero1.jpg)',
        'url(resources/images/hero2.jpg)',
        'url(resources/images/hero3.jpg)',
    ];
    let currentIndex = 0;

    function changeBackground() {
        currentIndex = (currentIndex + 1) % bgImages.length;
        $('.bg-images').css('background-image', bgImages[currentIndex])
            .css('opacity', 0)
            .animate({ opacity: 1 }, 2000);
    }

    setInterval(changeBackground, 5000);
    changeBackground();

    $('.transition-overlay').addClass('transition-all duration-500');

    // Transisi ciamik
    function showTransitionOverlay() {
        $('.transition-overlay').removeClass('hidden');
        $('.transition-overlay').removeClass('slide-up');
        $('.transition-overlay').addClass('block');
        $('.transition-overlay').addClass('slide-down');
    }

        $('.transition-overlay').removeClass('slide-down');
        $('.transition-overlay').removeClass('hidden');
        $('.transition-overlay').addClass('block');
        $('.transition-overlay').addClass('slide-up');
        setTimeout(function() {$('.transition-overlay').addClass('hidden');}, 1000)

    $('.nav-page').on('click', function(e) {
        if ($(this).attr('href') !== '#' && $(this).attr('href') !== '') {
            e.preventDefault();
            var link = $(this).attr('href');
            showTransitionOverlay();
            setTimeout(function() {
                window.location.href = link;
            }, 500);
        }
    });

    // signup, login, dan logout
    var loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        $('#signup-container').hide();
        $('#login-container').hide();
        $('#welcome-container').show();
        $('#welcomeName').html(loggedInUser.name + '!');
        // $('.logged-user').html(loggedInUser.name) tidak jadi dipakai karena aneh
    } else {
        $('#login-container').hide();
        $('#welcome-container').hide();
    }

    $('#login').on('click', function() {
        $('#signup-container').hide();
        $('#login-container').show();
    });

    $('#signup').on('click', function() {
        $('#login-container').hide();
        $('#signup-container').show();
    });

    $('#join-member-form').submit(function(e) {
        e.preventDefault();
        var name = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm-password').val();

        if (password !== confirmPassword) {
            alert('Password tidak sama');
            return;
        }

        var existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        var ExistingEmail = existingUsers.some(function(user) {
            return user.email === email
        });

        if (ExistingEmail) {
            alert('Emailmu sudah pernah didaftarkan!');
        } else {
            var newUser = {
                name: name,
                email: email,
                password: password
            };

            var templateParams = {
                to_name: name,
                to_email: email,
            };

            console.log(templateParams);

            emailjs.send('default_service', 'darjono_membership', templateParams)
                .then(function(response) {
                    existingUsers.push(newUser);
                    localStorage.setItem('users', JSON.stringify(existingUsers));
                    sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
                    alert('Terimakasih ' + templateParams.to_name + '. Anda telah terdaftarkan keanggotaan, silahkan buka email Anda.');
                    location.reload();
                }, function(error) {
                    alert('Terjadi kesalahan saat menambahkan keanggotaan.');
                });
        }
    });

    $('#login-member-form').submit(function(e) {
        e.preventDefault();
        var email = $('#logEmail').val();
        var password = $('#logPassword').val();

        var existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        var userFound = existingUsers.find(function(user) {
            return user.email === email && user.password === password;
        });
    
        if (userFound) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(userFound));
            alert('Berhasil login! Selamat datang, ' + userFound.name + '!');
            location.reload();
        } else {
            alert('Email atau password tidak valid, mohon ulangi lagi.');
        }
    });

    $('#logOut').click(function() {
        sessionStorage.removeItem('loggedInUser');
        $('#signup-container').show();
        $('#welcome-container').hide();
        location.reload();
    });

    // programs hidden
    $('.more-info').click(function() {
        var target = $(this).data('target');
        $(target).toggleClass('hidden');
    });
});

// Lupa ini tak tambahin buat apa
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});