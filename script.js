document.addEventListener('DOMContentLoaded', function() {
    const visitorCountElement = document.getElementById('visitor-count');

    const apiGatewayUrl = 'https://4bccrcdschbqkyvbnxt5pswxwi0kplfb.lambda-url.us-east-1.on.aws/';

    async function updateVisitorCount() {
        if (!visitorCountElement) {
            console.error('Visitor Counter: Element with ID "visitor-count" not found.');
            return;
        }

        try {
            const response = await fetch(apiGatewayUrl, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const count = data.count !== undefined ? data.count : data;


            if (typeof count === 'number') {
                visitorCountElement.textContent = count;
            } else {
                visitorCountElement.textContent = 'Error loading count.';
                console.error('Visitor Counter: Unexpected data format from API.', data);
            }

        } catch (error) {

            console.error('Visitor Counter: Error fetching visitor count:', error);
            if (visitorCountElement) {
                visitorCountElement.textContent = 'Could not load count.';
            }
        }
    }

    updateVisitorCount();
});
