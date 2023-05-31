<?php
session_start();
// Verifica se a sessão não está configurada corretamente
if (session_status() !== PHP_SESSION_ACTIVE) {
    header("Location: index.php");
}

// Verifica se a variável de sessão está definida
if (!isset($_SESSION["email"])) {
    header("Location: index.php");
}

// Se chegou até aqui, a sessão está correta
// Você pode continuar com a exibição da página protegida
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" href="images/icon.png" type="image/x-icon">
  <link rel="apple-touch-icon" href="images/app-icon.png">

  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  
  <link rel="stylesheet" href="css/bootstrap.min.css"/>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
  
  <!-- i will provide this in description  -->
  <link rel="stylesheet" href="css/slick.css"/>
  <link rel="stylesheet" href="css/slick-theme.css"/>
  <link rel="stylesheet" href="css/owl.carousel.min.css"/>
  <link rel="stylesheet" href="css/animate.min.css"/>
  <link rel="stylesheet" href="css/magnific-popup.css"/>
  <link rel="stylesheet" href="css/select2.min.css"/>
  <link rel="stylesheet" href="css/select2-bootstrap4.min.css"/>

  <link rel="stylesheet" href="css/slick-animation.css"/>
  <link rel="stylesheet" href="style.css"/>

  <title>Início – Baeflix</title>
</head>

<body>
  <header id="main-header">
    <div class="main-header">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-12">
            <nav class="navbar navbar-expand-lg navbar-light p-0">
              <a href="inicio.php" class="navbar-toggler c-toggler" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <div class="navbar-toggler-icon" data-toggle="collapse">
                  <span class="navbar-menu-icon navbar-menu-icon--top"></span>
                  <span class="navbar-menu-icon navbar-menu-icon--middle"></span>
                  <span class="navbar-menu-icon navbar-menu-icon--bottom"></span>
                </div>
              </a>
              <a href="inicio.php" class="navbar-brand">
                <img src="images/logo.png" class="img-fluid logo" alt="" />
              </a>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <div class="menu-main-menu-container">
                  <ul id="top-menu" class="navbar-nav ml-auto">
                    <li class="menu-item"><a href="inicio.php">Início</a></li>
                    <li class="menu-item"><a href="inicio.php">Filmes</a></li>
                    <li class="menu-item"><a href="inicio.php">Séries</a></li>
                    <li class="menu-item"><a href="inicio.php">Bombando</a></li>
                    <li class="menu-item"><a href="inicio.php">Minha Lista</a></li> 
                  </ul>
                </div>
              </div>
              <div class="mobile-more-menu">
                <a href="javascript:void(0);" class="more-toggle" id="dropdownMenuButton" data-toggle="more-toggle"
                  aria-haspopup="true" aria-expanded="false">
                  <i class="fa fa-ellipsis-h"></i>
                </a>
                <div class="more-menu" aria-labelledby="dropdownMenuButton">
                  <div class="navbar-right position-relative">
                    <ul class="d-flex align-items-center justify-content-end list-inline m-0">
                      <li>
                        <a href="inicio.php" class="search-toggle">
                          <i class="fa fa-search"></i>
                        </a>
                        <div class="search-box iq-search-bar">
                          <form action="inicio.php" class="searchbox">
                            <div class="form-group position-relative">
                              <input type="text" class="text search-input font-size-12"
                                placeholder="Títulos, gente e gêneros" />
                              <i class="search-link fa fa-search"></i>
                            </div>
                          </form>
                        </div>
                      </li>
                      <li class="nav-item nav-icon">
                        <a href="inicio.php" class="search-toggle position-relative">
                          <i class="fa fa-bell"></i>
                          <span class="bg-danger dots"></span>
                        </a>
                        <div class="iq-sub-dropdown">
                          <div class="iq-card shadow-none m-0">
                            <div class="iq-card-body">

                              <a href="#" target="_blank" class="iq-sub-card">
                                <div class="media align-items-center">
                                  <img src="images/notificacao/2023.jpg" alt="" class="img-fluid mr-3" />
                                  <div class="media-body">
                                    <h6 class="mb-0">Para única garota que amarei</h6>
                                    <small class="font-size-12">hoje</small>
                                  </div>
                                </div>
                              </a>

                              <a href="#" target="_blank" class="iq-sub-card">
                                <div class="media align-items-center">
                                  <img src="images/notificacao/2022.jpg" alt="" class="img-fluid mr-3" />
                                  <div class="media-body">
                                    <h6 class="mb-0">A minha escolha perfeita</h6>
                                    <small class="font-size-12">ontem</small>
                                  </div>
                                </div>
                              </a>
                              
                              <a href="#" target="_blank" class="iq-sub-card">
                                <div class="media align-items-center">
                                  <img src="images/notificacao/2021.jpg" alt="" class="img-fluid mr-3" />
                                  <div class="media-body">
                                    <h6 class="mb-0">Preto & branco combina?</h6>
                                    <small class="font-size-12">16 de jun.</small>
                                  </div>
                                </div>
                              </a>

                              <a href="#" target="_blank" class="iq-sub-card">
                                <div class="media align-items-center">
                                  <img src="images/notificacao/2020.jpg" alt="" class="img-fluid mr-3" />
                                  <div class="media-body">
                                    <h6 class="mb-0">Amizade em quarentena</h6>
                                    <small class="font-size-12">15 de jun.</small>
                                  </div>
                                </div>
                              </a>
                              
                              <a href="#" target="_blank" class="iq-sub-card">
                                <div class="media align-items-center">
                                  <img src="images/notificacao/2019.jpg" alt="" class="img-fluid mr-3" />
                                  <div class="media-body">
                                    <h6 class="mb-0">Férias de verão</h6>
                                    <small class="font-size-12">14 de jun.</small>
                                  </div>
                                </div>
                              </a>

                              <a href="#" target="_blank" class="iq-sub-card">
                                <div class="media align-items-center">
                                  <img src="images/notificacao/2018.jpg" alt="" class="img-fluid mr-3" />
                                  <div class="media-body">
                                    <h6 class="mb-0">prints para Beatriz</h6>
                                    <small class="font-size-12">13 de jun.</small>
                                  </div>
                                </div>
                              </a>

                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <a href="inicio.php" class="iq-user-dropdown search-toggle d-flex align-items-center">
                          <img src="images/user.png" alt="" />
                        </a>
                        <div class="iq-sub-dropdown iq-user-dropdown">
                          <div class="iq-card shadow-none m-0">
                            <div class="iq-card-body p-0 pl-3 pr-3">
                              <a href="inicio.php" class="iq-sub-card setting-dropdown">
                                <div class="media align-items-center">
                                  <div class="right-icon">
                                    <i class="fa fa-pencil text-primary"></i>
                                  </div>
                                  <div class="media-body ml-3">
                                    <h6 class="mb-0">Gerenciar Perfil</h6>
                                  </div>
                                </div>
                              </a>
                              <a href="inicio.php" class="iq-sub-card setting-dropdown">
                                <div class="media align-items-center">
                                  <div class="right-icon">
                                    <i class="fa fa-user text-primary"></i>
                                  </div>
                                  <div class="media-body ml-3">
                                    <h6 class="mb-0">Conta</h6>
                                  </div>
                                </div>
                              </a>
                              <a href="inicio.php" class="iq-sub-card setting-dropdown">
                                <div class="media align-items-center">
                                  <div class="right-icon">
                                    <i class="fa fa-question-circle text-primary"></i>
                                  </div>
                                  <div class="media-body ml-3">
                                    <h6 class="mb-0">Central de ajuda</h6>
                                  </div>
                                </div>
                              </a>
                              <a href="logout.php" class="iq-sub-card setting-dropdown">
                                <div class="media align-items-center">
                                  <div class="right-icon">
                                    <i class="fa fa-out text-primary"></i>
                                  </div>
                                  <div class="media-body ml-3">
                                    <h6 class="mb-0">Sair</h6>
                                  </div>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="navbar-right menu-right">
                <ul class="d-flex align-items-center list-inline m-0">
                  <li class="nav-item nav-icon">
                    <a href="inicio.php" class="search-toggle device-search">
                      <i class="fa fa-search"></i>
                    </a>
                    <div class="search-box iq-search-bar d-search">
                      <form action="inicio.php" class="searchbox">
                        <div class="form-group position-relative">
                          <input type="text" class="text search-input font-size-12"
                            placeholder="Títulos, gente e gêneros" />
                          <i class="search-link fa fa-search"></i>
                        </div>
                      </form>
                    </div>
                  </li>
                  <li class="nav-item nav-icon">
                    <a href="inicio.php" class="search-toggle" data-toggle="search-toggle">
                      <i class="fa fa-bell"></i>
                      <span class="bg-danger dots"></span>
                    </a>
                    <div class="iq-sub-dropdown">
                      <div class="iq-card shadow-none m-0">
                        <div class="iq-card-body">

                          <!--NOTIFICACÃO-->
                          <a href="#"target="_blank"  class="iq-sub-card">
                            <div class="media align-items-center">
                              <img src="images/notificacao/2023.jpg" alt="" class="img-fluid mr-3" />
                              <div class="media-body">
                                <h6 class="mb-0">Para única garota que amarei</h6>
                                <small class="font-size-12">hoje</small>
                              </div>
                            </div>
                          </a>

                          <a href="#" target="_blank" class="iq-sub-card">
                            <div class="media align-items-center">
                              <img src="images/notificacao/2022.jpg" alt="" class="img-fluid mr-3" />
                              <div class="media-body">
                                <h6 class="mb-0">A minha escolha perfeita</h6>
                                <small class="font-size-12">ontem</small>
                              </div>
                            </div>
                          </a>

                          <a href="#" target="_blank" class="iq-sub-card">
                            <div class="media align-items-center">
                              <img src="images/notificacao/2021.jpg" alt="" class="img-fluid mr-3" />
                              <div class="media-body">
                                <h6 class="mb-0">Preto & branco combina?</h6>
                                <small class="font-size-12">16 de jun.</small>
                              </div>
                            </div>
                          </a>

                          <a href="#" target="_blank" class="iq-sub-card">
                            <div class="media align-items-center">
                              <img src="images/notificacao/2020.jpg" alt="" class="img-fluid mr-3" />
                              <div class="media-body">
                                <h6 class="mb-0">
                                  Amizade em quarentena
                                </h6>
                                <small class="font-size-12">15 de jun.</small>
                              </div>
                            </div>
                          </a>

                          <a href="#" target="_blank" class="iq-sub-card">
                            <div class="media align-items-center">
                              <img src="images/notificacao/2019.jpg" alt="" class="img-fluid mr-3" />
                              <div class="media-body">
                                <h6 class="mb-0">Férias de verão</h6>
                                <small class="font-size-12">14 de jun.</small>
                              </div>
                            </div>
                          </a>

                          <a href="#" target="_blank" class="iq-sub-card">
                            <div class="media align-items-center">
                              <img src="images/notificacao/2018.jpg" alt="" class="img-fluid mr-3" />
                              <div class="media-body">
                                <h6 class="mb-0">prints para Beatriz</h6>
                                <small class="font-size-12">13 de jun.</small>
                              </div>
                            </div>
                          </a>

                        </div>
                      </div>
                    </div>
                  </li>
                  <li class="nav-item nav-icon">
                    <a href="inicio.php" class="iq-user-dropdown search-toggle d-flex align-items-center p-0">
                      <img style="border-radius: 2px;" src="images/user.png" class="img-fluid user-m" alt="" />
                    </a>
                    <div class="iq-sub-dropdown iq-user-dropdown">
                      <div class="iq-card shadow-none m-0">
                        <div class="iq-card-body p-0 pl-3 pr-3">
                          <a href="inicio.php" class="iq-sub-card setting-dropdown">
                            <div class="media align-items-center">
                              <div class="right-icon">
                                <i class="fa fa-pencil text-primary"></i>
                              </div>
                              <div class="media-body ml-3">
                                <h6 class="mb-0">Gerenciar Perfil</h6>
                              </div>
                            </div>
                          </a>
                          <a href="inicio.php" class="iq-sub-card setting-dropdown">
                            <div class="media align-items-center">
                              <div class="right-icon">
                                <i class="fa fa-user text-primary"></i>
                              </div>
                              <div class="media-body ml-3">
                                <h6 class="mb-0">Conta</h6>
                              </div>
                            </div>
                          </a>
                          <a href="inicio.php" class="iq-sub-card setting-dropdown">
                            <div class="media align-items-center">
                              <div class="right-icon">
                                <i class="fa fa-question-circle text-primary"></i>
                              </div>
                              <div class="media-body ml-3">
                                <h6 class="mb-0">Central de ajuda</h6>
                              </div>
                            </div>
                          </a>
                          <a href="logout.php" class="iq-sub-card setting-dropdown">
                            <div class="media align-items-center">
                              <div class="right-icon">
                                <i class="fa fa-out text-primary"></i>
                              </div>
                              <div class="media-body ml-3">
                                <h6 class="mb-0">Sair</h6>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
            <div class="nav-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- slider starts  -->
  <section id="home" class="iq-main-slider p-0">
    <div id="home-slider" class="slider m-0 p-0">
      <div class="slide slick-bg s-bg-1">
        <div class="container-fluid position-relative h-100">
          <div class="slider-inner h-100">
            <div class="row align-items-center h--100">
              <div class="col-xl-6 col-lg-12 col-md-12">
                  <div class="channel-logo d-flex justify-content-center" data-animation-in="fadeInLeft" data-delay-in="0.5">
                    <img src="images/titulo/2023.png" class="c-logo img-fluid" alt=""/>
                  </div>
                <!--SINOPSE-->
                <p data-animation-in="fadeInUp">
                  Um namorado decidido a demonstrar seu amor por sua namorada através de gestos românticos e criativos em busca de manter o amor sempre aceso. Uma linda jornada que celebra a importância de expressar o amor de uma maneira genuína.
                </p>
                <div class="d-flex align-items-center r-mb-23 mt-4" data-animation-in="fadeInUp" data-delay-in="1.2">
                  <a href="#" target="_blank" class="btn btn-hover iq-button"><i class="fa fa-play mr-3"></i>Assistir</a> <!--MUDAR LINK DO VIDEO-->
                  <a href="inicio.php" class="btn btn-hover iq-button"><i class="fa fa-info-circle mr-3"></i>Mais informações</a> <!--MUDAR LINK DO INSTA-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </section>
  <!-- slider ends -->

  <!-- main content starts  -->
  <div class="main-content">
    <!-- favorite section starts   -->

    <section id="iq-favorites">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-12 overflow-hidden">
            <div class="iq-main-header d-flex align-items-center justify-content-between">
              <h4 class="main-title">Recomendados</h4>
            </div>
            <div class="favorite-contens">
              <ul class="favorites-slider list-inline row p-0 mb-0">

                <!-- RECOMENDADOS RECOMENDADOS RECOMENDADOS -->
                <li class="slide-item">
                  <div class="block-images position-relative">
                    <div class="img-box">
                      <img src="images/slider/2018.jpg" class="img-fluid" alt="" />
                    </div>
                    <div class="block-description">    
                      <div class="hover-buttons">
                        <span style="margin-top: 50px;" class="btn btn-hover iq-button">
                          <i class="fa fa-play mr-1"></i>
                        <a style="color: black;" href="#" target="_blank">Assistir</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="slide-item">
                  <div class="block-images position-relative">
                    <div class="img-box">
                      <img src="images/slider/2019.jpg" class="img-fluid" alt="" />
                    </div>
                    <div class="block-description">    
                      <div class="hover-buttons">
                        <span style="margin-top: 50px;" class="btn btn-hover iq-button">
                          <i class="fa fa-play mr-1"></i>
                        <a style="color: black;" href="#" target="_blank">Assistir</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="slide-item">
                  <div class="block-images position-relative">
                    <div class="img-box">
                      <img src="images/slider/2020.jpg" class="img-fluid" alt="" />
                    </div>
                    <div class="block-description">    
                      <div class="hover-buttons">
                        <span style="margin-top: 50px;" class="btn btn-hover iq-button">
                          <i class="fa fa-play mr-1"></i>
                        <a style="color: black;" href="#" target="_blank">Assistir</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="slide-item">
                  <div class="block-images position-relative">
                    <div class="img-box">
                      <img src="images/slider/2021.jpg" class="img-fluid" alt="" />
                    </div>
                    <div class="block-description">    
                      <div class="hover-buttons">
                        <span style="margin-top: 50px;" class="btn btn-hover iq-button">
                          <i class="fa fa-play mr-1"></i>
                        <a style="color: black;" href="#" target="_blank">Assistir</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li class="slide-item">
                  <div class="block-images position-relative">
                    <div class="img-box">
                      <img src="images/slider/2022.jpg" class="img-fluid" alt="" />
                    </div>
                    <div class="block-description">    
                      <div class="hover-buttons">
                        <span style="margin-top: 50px;" class="btn btn-hover iq-button">
                          <i class="fa fa-play mr-1"></i>
                        <a style="color: black;" href="#" target="_blank">Assistir</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

  <footer class="iq-bg-dark">
    <div class="footer-top">
      <div class="container-fluid">
        <div class="row footer-standard">
          <div class="col-lg-5">
            <div class="widget text-left">
              <div>
                <ul class="menu p-0">
                  <li><a href="inicio.php">Dedicatória</a></li>
                </ul>
              </div>
            </div>
            <div class="widget text-left">
              <div class="textwidget">
                <p><small>Desenvolvido para minha amada Beatriz, este site é uma demonstração do amor que sinto por você, é um espaço onde expresso o quanto você é especial em minha vida. Cada página e detalhe foram pensados com amor e carinho como uma forma de lembrar e eternizar alguns momenos que passamos juntos. Espero que você se sinta amada e valorizada. Agradeço por ser a pessoa incrível que você é, por me ajudar a ser melhor a cada dia. Que este site seja apenas um epsódio de uma história que estamos vivendo juntos. <br> <br> Com todo o meu amor, Pedro.</small></p>
              </div>
            </div>
            <br>
            <a href="https://www.instagram.com/_baeflix/" target="_blank">
              <i>
              <fa class="fa fa-instagram"></fa>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <!-- js files  -->
  <script src="js/jquery-3.4.1.min.js"></script>
  <script src="js/popper.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
  <script src="js/slick.min.js"></script>
  <script src="js/owl.carousel.min.js"></script>
  <script src="js/select2.min.js"></script>
  <script src="js/jquery.magnific-popup.min.js"></script>
  <script src="js/slick-animation.min.js"></script>

  <script src="main.js"></script>
</body>

</html>