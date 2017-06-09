/**
 * Utility file to help with the creation of hero cards from 
 * individual products from MTL API
 */

const CLOUDINARY_ID = process.env.CLOUDINARY_ID;

function createHeroCardFromProduct (session, builder, productInfo) {
    let title = productInfo.name;
    let price = productInfo.price;
    let salePrice = productInfo.salePrice || "--";
    let retailer = productInfo.retailer;
    let description = productInfo.description;
    let url = productInfo.clickUrl;
    let imageUrl = `http://res.cloudinary.com/${CLOUDINARY_ID}/image/fetch/w_500,h_260,c_pad/${productInfo.image}`;
    let subtitle = `${productInfo.retailer}, $${price}`;

    return new builder.HeroCard(session)
        .title(title)
        .subtitle(subtitle)
        .text(description)
        .images([
            builder.CardImage.create(session, imageUrl)
        ])
        .buttons([
            builder.CardAction.openUrl(session, url)
        ]);
};

function createMessageWithButtons(session, builder, titles, values, text) {
    const card = new builder.ThumbnailCard(session);
    let options = titles.map(function (title, index) {
        return new builder.CardAction(session).title(title).value(values[index]).type('imBack');
    });
    card.buttons(options).text(text);
    const message = new builder.Message(session);
    message.addAttachment(card);
    return message;
}

exports.createHeroCardFromProduct = createHeroCardFromProduct;
exports.createMessageWithButtons = createMessageWithButtons;