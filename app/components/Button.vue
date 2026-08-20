<template>
    <UButton @click="handleClick">{{ label }}</UButton>
</template>

<script setup>
    const props = defineProps({
        label: {
            type: String,
            required: true
        },
        href: {
            type: String,
            default: null
        }
    })

    const emit = defineEmits(['click'])
     const handleClick = () => {
        emit('click')

        if(props.href){
            navigateTo(props.href)
        }
    }
</script>