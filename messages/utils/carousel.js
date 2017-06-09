/**
 * Utility file to help with the creation of a carousel of hero cards
 * from an array of products from MTL API
 */
const herocard = require('./herocard');

function createCarouselFromProducts (session, builder, products){
    let cards = products.map(product => {
       return herocard.createHeroCardFromProduct(session, builder, product)
    });

    let carouselMessage = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);

    return carouselMessage;
};

exports.createCarouselFromProducts = createCarouselFromProducts;