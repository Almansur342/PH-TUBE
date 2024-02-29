const errorElement = document.getElementById('error-element');
const sortBtn = document.getElementById('sort-btn');

 
const fetchCategories = async () =>{
  const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
  const data = await res.json();
  const categories = data.data;
  displayBtn(categories)
  // console.log(categories);
}
 const displayBtn = (data) =>{
  const btnContainer = document.getElementById('btn-container');
  data.forEach(card => {
    const newBtn = document.createElement('button');
    newBtn.className = 'category-btn btn btn-ghost bg-slate-700 text-white text-lg';
    newBtn.innerText = card.category;
    newBtn.addEventListener('click', () =>{ 
    fetchDataByCategories(card.category_id);
    const allBtns = document.querySelectorAll('.category-btn');
    for(btn of allBtns){
      btn.classList.remove('bg-red-600');
    }
    newBtn.classList.add('bg-red-600');
    })
    btnContainer.appendChild(newBtn);
  });
 }

  let selectedCategories = 1000;
  let sorted = false;

  sortBtn.addEventListener('click', () =>{
    sorted = true;
    fetchDataByCategories(selectedCategories, sorted);
  })

 const fetchDataByCategories = async (categoryId, sorted) =>{
 selectedCategories = categoryId;
  const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
  const data = await res.json();
  const videos = data.data;
  displayView(videos, sorted);
 
 }

 const displayView = (videos, sorted) =>{
  const cardContainer = document.getElementById('card-container');
  if(sorted){
    videos.sort((a, b) => {
      const totalViewsStrFirst = a.others?.views;
      const totalViewsStrSecond = b.others?.views;
      const totalViewsStrFirstNumber = parseFloat(totalViewsStrFirst.replace("k", '')) || 0;
      const totalViewsStrSecondNumber = parseFloat(totalViewsStrSecond.replace("k", '')) || 0;

      return totalViewsStrSecondNumber - totalViewsStrFirstNumber;

    })
  }
  if(videos.length === 0){
    errorElement.classList.remove('hidden');
  } else{
    errorElement.classList.add('hidden');
  }
  cardContainer.textContent = '';
  videos.forEach((video) =>{
    let verifiedBadge = ''
    if(video.authors[0].verified){
      verifiedBadge = `<img class="w-6 h-6" src="./images/verify.png" alt=""></img>`
    }
    const newCard = document.createElement('div');
    newCard.innerHTML = `
    <div class="card w-full bg-base-100 shadow-xl">
    <figure class="overflow-hidden h-72">
        <img class="w-full" src="${video.thumbnail}" alt="Shoes" />
        <h6 class="absolute bottom-[40%] right-12">0 hr</h6>
    </figure>
    <div class="card-body">
        <div class="flex space-x-4 justify-start items-start">
            <div>
                <img class="w-12 h-12 rounded-full" src="${video.authors[0].profile_picture}" alt="Shoes" />
            </div>
            <div>
                <h2 class="card-title">${video.title}</h2>
                <div class="flex mt-3">
                    <p class="">${video.authors[0].profile_name}</p>
                     ${verifiedBadge}
                </div>
                <p class="mt-3">${video.others.views}</p>
            </div>
        </div>
    </div>
</div>
    `
    cardContainer.appendChild(newCard);
    console.log(video)
  })
 }


fetchCategories()
fetchDataByCategories(selectedCategories, sorted);