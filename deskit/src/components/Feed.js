// src/components/Feed.js
import React from 'react';

const Feed = () => {
  const photos = [
    {
      id: 1,
      imageUrl: 'https://via.placeholder.com/300',
      description: '깔끔한 책상 데스크테리어',
      products: ['책상', '모니터', '책장']
    },
    {
      id: 2,
      imageUrl: 'https://via.placeholder.com/300',
      description: '모던한 스타일의 책상 꾸미기',
      products: ['책상', '스탠드', '의자']
    }
  ];

  return (
    <div className="feed">
      {photos.map(photo => (
        <div key={photo.id} className="photo">
          <img src={photo.imageUrl} alt={photo.description} />
          <h3>{photo.description}</h3>
          <ul>
            {photo.products.map((product, index) => (
              <li key={index}>{product}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Feed;
