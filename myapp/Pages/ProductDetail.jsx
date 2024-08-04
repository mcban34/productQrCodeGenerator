import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [sanitizedHtml, setSanitizedHtml] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost/qrApp/api/product_detail.php?id=${id}`);
                setProduct(response.data);
                const sanitized = DOMPurify.sanitize(response.data.description);
                setSanitizedHtml(sanitized);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{product.title}</h1>
            {/*AÇIKLAMA => */} <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            {product.image && product.image.map((img, index) => (
                <img key={index} src={`http://localhost/qrApp/api/${img}`} alt={`Image ${index}`} />
            ))}
        </div>
    );
};

export default ProductDetail;
