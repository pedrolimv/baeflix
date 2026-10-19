# Baeflix ❤

Presente de 4 anos de namoro. Um site estático (HTML + CSS + JS), sem instalar nada.

## Telas
| Arquivo | Tela |
|---|---|
| `index.html` | Inicial: "Saiba mais" abre a mensagem, "Entrar" leva ao login |
| `login.html` | Email ou celular dela + senha (guardados só como hash em `js/dados.js`) |
| `perfis.html` | "Quem está assistindo?" (2 perfis) |
| `inicio.html` | Banner, fileiras, Top 10, card ao passar o mouse, detalhes, player, busca, Minha lista, Bombando |

## Player
- Barra vermelha (clique ou arraste), voltar/avançar 10s, volume, velocidade (0,5x a 1,5x), tela cheia
- Pausado por 5s mostra "Você está assistindo"; no fim, "Assistir de novo" e o próximo filme em 10s
- Lembra onde parou ("Continuar assistindo")
- Teclado: **espaço** pausa · **← →** 10s · **↑ ↓** volume · **M** mudo · **F** tela cheia · **Esc** sai

## Arquivos
| O quê | Onde | Formato |
|---|---|---|
| Vídeo | `videos/<id>.mp4` | MP4 (H.264) |
| Capa com título | `imagens/capas/<id>.jpg` | horizontal 16:9 |
| Pôster com título | `imagens/posters/<id>.jpg` | vertical 2:3 (Top 10 e banner no celular) |
| Fundo sem título (banner) | `imagens/fundos/<id>.jpg` e `<id>-mobile.jpg` | opcional; campos `fundo` e `fundoMobile` |
| Foto do perfil | `imagens/perfis/pedro.webp`, `bae.webp` | quadrada |
| Logo | `imagens/logo/baeflix.svg` (topo) e `baeflix-b.svg` (ícone da aba e selo do banner no celular) | SVG |

Textos, sinopses, datas, ordem das fileiras, Top 10 e banner ficam em **`js/dados.js`**.
O banner grande usa `destaque` (hoje: Simplesmente Acontece, com o título escrito separado da imagem).

### Falta adicionar
- **Simplesmente Acontece**: o vídeo `videos/simplesmente-acontece.mp4` (e a duração em `duracao` no `dados.js`).
- **Days Before the Day** (Em breve, estreia 10/05/2027): quando estrear, coloque `videos/days-before-the-day.mp4`
  e mova o item de `emBreve` para `videos` em `dados.js`.

## Publicado
**https://pedrolimv.github.io/baeflix/** (repositório público `pedrolimv/baeflix`, GitHub Pages na branch `main`).

Para atualizar depois de mudar algo (no terminal, dentro desta pasta):
```
git add -A
git commit -m "Atualiza Baeflix"
git push
```
O site atualiza sozinho em 1–2 minutos.

## Como abrir
- **No computador:** dê dois cliques em `index.html`.
- **Online (para abrir no celular/TV dela):** arraste a pasta inteira no [Netlify Drop](https://app.netlify.com/drop)
  ou publique no GitHub Pages. A pasta tem ~95 MB de vídeos.

> O login é só de brincadeira: a senha fica no código do site. Se publicar online, qualquer pessoa
> com o link e um pouco de conhecimento consegue ver os vídeos.
