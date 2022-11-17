import * as jsonpatch from 'fast-json-patch';

import { Alert, styled, useMediaQuery, useTheme } from '@mui/material';
import { ConditionallyRender } from 'component/common/ConditionallyRender/ConditionallyRender';
import { PageContent } from 'component/common/PageContent/PageContent';
import { PageHeader } from 'component/common/PageHeader/PageHeader';
import PermissionButton from 'component/common/PermissionButton/PermissionButton';
import { Search } from 'component/common/Search/Search';
import { updateWeight } from 'component/common/util';
import { UPDATE_FEATURE_VARIANTS } from 'component/providers/AccessProvider/permissions';
import { useEnvironments } from 'hooks/api/getters/useEnvironments/useEnvironments';
import { useFeature } from 'hooks/api/getters/useFeature/useFeature';
import { useRequiredPathParam } from 'hooks/useRequiredPathParam';
import { IFeatureEnvironment, IFeatureVariant } from 'interfaces/featureToggle';
import { useMemo, useState } from 'react';
import { EnvironmentVariantModal } from './EnvironmentVariantModal/EnvironmentVariantModal';
import { EnvironmentVariantsCard } from './EnvironmentVariantsCard/EnvironmentVariantsCard';
import { VariantDeleteDialog } from './VariantDeleteDialog/VariantDeleteDialog';
import useFeatureApi from 'hooks/api/actions/useFeatureApi/useFeatureApi';
import { formatUnknownError } from 'utils/formatUnknownError';
import useToast from 'hooks/useToast';
import { EnvironmentVariantsCopyFrom } from './EnvironmentVariantsCopyFrom/EnvironmentVariantsCopyFrom';

const StyledAlert = styled(Alert)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    '& code': {
        fontWeight: theme.fontWeight.bold,
    },
}));

const StyledButtonContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1.5),
}));

export const FeatureEnvironmentVariants = () => {
    const { setToastData, setToastApiError } = useToast();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const projectId = useRequiredPathParam('projectId');
    const featureId = useRequiredPathParam('featureId');
    const { feature, refetchFeature, loading } = useFeature(
        projectId,
        featureId
    );
    const { patchFeatureEnvironmentVariants } = useFeatureApi();
    const { environments: allEnvironments } = useEnvironments();

    const [searchValue, setSearchValue] = useState('');
    const [selectedEnvironment, setSelectedEnvironment] =
        useState<IFeatureEnvironment>();
    const [selectedVariant, setSelectedVariant] = useState<IFeatureVariant>();
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const environments = useMemo(
        () =>
            feature.environments.map(environment => ({
                ...environment,
                deprecated: !allEnvironments.some(
                    ({ name, enabled }) => name === environment.name && enabled
                ),
                variants: environment.variants ?? [],
            })),
        [feature, allEnvironments]
    );

    const createPatch = (
        variants: IFeatureVariant[],
        newVariants: IFeatureVariant[]
    ) => {
        return jsonpatch.compare(variants, newVariants);
    };

    const getPayload = (
        variants: IFeatureVariant[],
        newVariants: IFeatureVariant[]
    ) => {
        const updatedNewVariants = updateWeight(newVariants, 1000);
        return createPatch(variants, updatedNewVariants);
    };

    const updateVariants = async (
        environment: IFeatureEnvironment,
        variants: IFeatureVariant[]
    ) => {
        const environmentVariants = environment.variants ?? [];
        const patch = getPayload(environmentVariants, variants);

        if (patch.length === 0) return;

        await patchFeatureEnvironmentVariants(
            projectId,
            featureId,
            environment.name,
            patch
        );
        refetchFeature();
    };

    const addVariant = (environment: IFeatureEnvironment) => {
        setSelectedEnvironment(environment);
        setSelectedVariant(undefined);
        setModalOpen(true);
    };

    const editVariant = (
        environment: IFeatureEnvironment,
        variant: IFeatureVariant
    ) => {
        setSelectedEnvironment(environment);
        setSelectedVariant(variant);
        setModalOpen(true);
    };

    const deleteVariant = (
        environment: IFeatureEnvironment,
        variant: IFeatureVariant
    ) => {
        setSelectedEnvironment(environment);
        setSelectedVariant(variant);
        setDeleteOpen(true);
    };

    const onDeleteConfirm = async () => {
        if (selectedEnvironment && selectedVariant) {
            const variants = selectedEnvironment.variants ?? [];

            const updatedVariants = variants.filter(
                ({ name }) => name !== selectedVariant.name
            );

            await updateVariants(selectedEnvironment, updatedVariants);
            setDeleteOpen(false);
        }
    };

    const onVariantConfirm = async (updatedVariants: IFeatureVariant[]) => {
        if (selectedEnvironment) {
            try {
                await updateVariants(selectedEnvironment, updatedVariants);
                setModalOpen(false);
                setToastData({
                    title: `Variant ${
                        selectedVariant ? 'updated' : 'added'
                    } successfully`,
                    type: 'success',
                });
            } catch (error: unknown) {
                setToastApiError(formatUnknownError(error));
            }
        }
    };

    const onCopyVariantsFrom = async (
        fromEnvironment: IFeatureEnvironment,
        toEnvironment: IFeatureEnvironment
    ) => {
        try {
            const variants = fromEnvironment.variants ?? [];
            await updateVariants(toEnvironment, variants);
            setToastData({
                title: 'Variants copied successfully',
                type: 'success',
            });
        } catch (error: unknown) {
            setToastApiError(formatUnknownError(error));
        }
    };

    const onUpdateStickiness = async (
        environment: IFeatureEnvironment,
        updatedVariants: IFeatureVariant[]
    ) => {
        try {
            await updateVariants(environment, updatedVariants);
            setToastData({
                title: 'Variant stickiness updated successfully',
                type: 'success',
            });
        } catch (error: unknown) {
            setToastApiError(formatUnknownError(error));
        }
    };

    return (
        <PageContent
            isLoading={loading}
            header={
                <PageHeader
                    title="Variants"
                    actions={
                        <ConditionallyRender
                            condition={!isSmallScreen}
                            show={
                                <>
                                    <Search
                                        initialValue={searchValue}
                                        onChange={setSearchValue}
                                    />
                                </>
                            }
                        />
                    }
                >
                    <ConditionallyRender
                        condition={isSmallScreen}
                        show={
                            <Search
                                initialValue={searchValue}
                                onChange={setSearchValue}
                            />
                        }
                    />
                </PageHeader>
            }
        >
            <StyledAlert severity="info">
                Variants allows you to return a variant object if the feature
                toggle is considered enabled for the current request. When using
                variants you should use the <code>getVariant()</code> method in
                the Client SDK.
            </StyledAlert>
            {environments.map(environment => {
                const otherEnvsWithVariants = environments.filter(
                    ({ name, variants }) =>
                        name !== environment.name && variants.length
                );

                return (
                    <EnvironmentVariantsCard
                        key={environment.name}
                        environment={environment}
                        searchValue={searchValue}
                        onAddVariant={() => addVariant(environment)}
                        onEditVariant={(variant: IFeatureVariant) =>
                            editVariant(environment, variant)
                        }
                        onDeleteVariant={(variant: IFeatureVariant) =>
                            deleteVariant(environment, variant)
                        }
                        onUpdateStickiness={(variants: IFeatureVariant[]) =>
                            onUpdateStickiness(environment, variants)
                        }
                    >
                        <ConditionallyRender
                            condition={environment.variants.length === 0}
                            show={
                                <StyledButtonContainer>
                                    <PermissionButton
                                        onClick={() => addVariant(environment)}
                                        variant="outlined"
                                        permission={UPDATE_FEATURE_VARIANTS}
                                        projectId={projectId}
                                    >
                                        Add variant
                                    </PermissionButton>
                                    <EnvironmentVariantsCopyFrom
                                        environment={environment}
                                        permission={UPDATE_FEATURE_VARIANTS}
                                        projectId={projectId}
                                        onCopyVariantsFrom={onCopyVariantsFrom}
                                        otherEnvsWithVariants={
                                            otherEnvsWithVariants
                                        }
                                    />
                                </StyledButtonContainer>
                            }
                        />
                    </EnvironmentVariantsCard>
                );
            })}
            <EnvironmentVariantModal
                environment={selectedEnvironment}
                variant={selectedVariant}
                open={modalOpen}
                setOpen={setModalOpen}
                getPayload={getPayload}
                onConfirm={onVariantConfirm}
            />
            <VariantDeleteDialog
                variant={selectedVariant}
                open={deleteOpen}
                setOpen={setDeleteOpen}
                onConfirm={onDeleteConfirm}
            />
        </PageContent>
    );
};
