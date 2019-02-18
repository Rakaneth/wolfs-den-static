<template>
    <div class='grid-container'>
        <div class='label'>Vitality</div>
        <div class='vit'>{{ creature.vit}}/{{creature.maxVit}}</div>
        <div class='label'>Endurance</div>
        <div class='edr'>{{ creature.edr}}/{{creature.maxEdr}}</div>
    </div>
</template>

<script>
export default {
    name: 'vitals',
    props: {
        creature: Object
    }
}
</script>

<style scoped>
.label {
    color: yellow;
    font-weight: bold;
    text-align: right;
    margin-right: 10px;
}

.vit {
    color: crimson;
}

.edr {
    color: orange;
}
</style>


