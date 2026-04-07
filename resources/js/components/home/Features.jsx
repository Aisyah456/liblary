{
    service.features && (
        <FeatureList>
            {service.features.map((feature, index) => (
                <li key={index}>{feature}</li>
            ))}
        </FeatureList>
    );
}
